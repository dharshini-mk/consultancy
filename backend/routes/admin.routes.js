const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs") // Add this import
const Admin = require("../models/Admin")
const Appointment = require("../models/Appointment")
const authMiddleware = require("../middleware/auth.mw")
const sendSMS = require("./sendsms.js")

// Add these imports at the top of the file
const PDFDocument = require("pdfkit")
const { format } = require("date-fns")

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    console.log("Login attempt for username:", username)

    // Check if admin exists
    const admin = await Admin.findOne({ username })
    if (!admin) {
      console.log("Admin not found:", username)
      return res.status(400).json({ message: "Invalid credentials" })
    }

    console.log("Admin found:", admin.username)

    // Try both methods to compare passwords for debugging
    let isMatch = false

    // Method 1: Using the model method
    try {
      isMatch = await admin.comparePassword(password)
      console.log("Password match using model method:", isMatch)
    } catch (err) {
      console.error("Error using model method:", err)
    }

    // Method 2: Using bcrypt directly as fallback
    if (!isMatch) {
      try {
        isMatch = await bcrypt.compare(password, admin.password)
        console.log("Password match using bcrypt directly:", isMatch)
      } catch (err) {
        console.error("Error using bcrypt directly:", err)
      }
    }

    if (!isMatch) {
      console.log("Password does not match")
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create and return JWT token
    const payload = {
      admin: {
        id: admin.id,
        username: admin.username,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) throw err
      console.log("Token generated successfully")
      res.json({ token })
    })
  } catch (err) {
    console.error("Login error:", err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET /api/admin/dashboard
// @desc    Get dashboard data
// @access  Private
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    // Get counts for dashboard
    const totalBookings = await Appointment.countDocuments()
    const approvedBookings = await Appointment.countDocuments({ status: "approved" })
    const pendingBookings = await Appointment.countDocuments({ status: "pending" })
    const rejectedBookings = await Appointment.countDocuments({ status: "rejected" })
    const notificationsSent = await Appointment.countDocuments({ "whatsappNotification.sent": true })

    // Get service distribution
    const hairBookings = await Appointment.countDocuments({ service: "hair" })
    const skinBookings = await Appointment.countDocuments({ service: "skin" })
    const bridalBookings = await Appointment.countDocuments({ service: "bridal" })
    const nailsBookings = await Appointment.countDocuments({ service: "nails" })

    res.json({
      totalBookings,
      approvedBookings,
      pendingBookings,
      rejectedBookings,
      notificationsSent,
      serviceDistribution: {
        hair: hairBookings,
        skin: skinBookings,
        bridal: bridalBookings,
        nails: nailsBookings,
      },
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filters
// @access  Private
router.get("/bookings", authMiddleware, async (req, res) => {
  try {
    const { date, service, status, page = 1, limit = 10 } = req.query

    // Build filter object
    const filter = {}
    if (date) filter.date = new Date(date)
    if (service) filter.service = service
    if (status) filter.status = status

    // Get bookings with pagination
    const bookings = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number.parseInt(limit))

    // Get total count for pagination
    const total = await Appointment.countDocuments(filter)

    res.json({
      bookings,
      pagination: {
        total,
        page: Number.parseInt(page),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT /api/admin/bookings/:id/approve
// @desc    Approve a booking
// @access  Private
router.put("/bookings/:id/approve", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update status to "approved"
    appointment.status = "approved";
    await appointment.save();

    // Prepare the SMS message
    const message = `Hello ${appointment.name}, your appointment for ${appointment.service} service on ${new Date(
      appointment.date
    ).toLocaleDateString()} at ${appointment.time} has been approved. Thank you for choosing our parlor!`;

    // Format the phone number
    const phoneNumber = appointment.phone.startsWith("+")
      ? appointment.phone
      : `+91${appointment.phone}`; // Assuming the default country code is India

    // Send the SMS via Twilio
    try {
      const result = await sendSMS(phoneNumber, message);

      // Update the appointment's SMS notification status
      appointment.smsNotification = {
        sent: true,
        timestamp: new Date(),
      };
      await appointment.save();

      // Notify all connected clients via socket.io
      req.io.emit("booking-updated", appointment);

      // Respond with appointment details and SMS result
      res.json({ appointment, smsResult: result });
    } catch (smsError) {
      console.error("SMS notification error:", smsError);

      // Mark SMS as failed but still approve the appointment
      appointment.smsNotification = {
        sent: false,
        error: smsError.message,
      };
      await appointment.save();

      // Notify connected clients
      req.io.emit("booking-updated", appointment);

      res.status(500).json({
        appointment,
        error: "Failed to send SMS notification. You can retry later.",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/admin/bookings/:id/reject
// @desc    Reject a booking
// @access  Private
router.put("/bookings/:id/reject", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Update status
    appointment.status = "rejected"
    await appointment.save()

    // Notify all connected clients
    req.io.emit("booking-updated", appointment)

    res.json({ appointment })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST /api/admin/bookings/:id/retry-whatsapp
// @desc    Retry sending WhatsApp notification
// @access  Private
router.post("/bookings/:id/retry-whatsapp", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    if (appointment.status !== "approved") {
      return res.status(400).json({ message: "Cannot send notification for non-approved booking" })
    }

    // Send WhatsApp notification
    try {
      const message = `Hello ${appointment.name}, your appointment for ${appointment.service} service on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been approved. Thank you for choosing our parlor!`

      const result = await sendWhatsAppMessage(appointment.phone, message)

      // Update notification status
      appointment.whatsappNotification.sent = true
      appointment.whatsappNotification.timestamp = new Date()
      await appointment.save()

      // Notify all connected clients
      req.io.emit("booking-updated", appointment)

      res.json({ appointment, whatsappResult: result })
    } catch (whatsappError) {
      console.error("WhatsApp notification retry error:", whatsappError)

      res.status(500).json({
        message: "Failed to send WhatsApp notification",
        error: whatsappError.message,
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET /api/admin/export
// @desc    Export bookings as CSV
// @access  Private
router.get("/export", authMiddleware, async (req, res) => {
  try {
    const { date, service, status } = req.query

    // Build filter object
    const filter = {}
    if (date) filter.date = new Date(date)
    if (service) filter.service = service
    if (status) filter.status = status

    // Get all bookings matching the filter
    const bookings = await Appointment.find(filter).sort({ createdAt: -1 })

    // Convert to CSV format
    const { convertToCSV } = require("../utils/excelUtils")
    const csv = convertToCSV(bookings)

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=bookings.csv")

    res.send(csv)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Add this new route for analytics
// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Private
router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query
    
    // Parse dates
    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1))
    const end = endDate ? new Date(endDate) : new Date()
    
    // Set end date to end of day
    end.setHours(23, 59, 59, 999)
    
    // Build date filter
    const dateFilter = {
      date: {
        $gte: start,
        $lte: end
      }
    }
    
    // Get counts for dashboard
    const totalBookings = await Appointment.countDocuments(dateFilter)
    const approvedBookings = await Appointment.countDocuments({ ...dateFilter, status: "approved" })
    const pendingBookings = await Appointment.countDocuments({ ...dateFilter, status: "pending" })
    const rejectedBookings = await Appointment.countDocuments({ ...dateFilter, status: "rejected" })
    const notificationsSent = await Appointment.countDocuments({ 
      ...dateFilter, 
      status: "approved",
      "whatsappNotification.sent": true 
    })

    // Get service distribution
    const hairBookings = await Appointment.countDocuments({ ...dateFilter, service: "hair" })
    const skinBookings = await Appointment.countDocuments({ ...dateFilter, service: "skin" })
    const bridalBookings = await Appointment.countDocuments({ ...dateFilter, service: "bridal" })
    const nailsBookings = await Appointment.countDocuments({ ...dateFilter, service: "nails" })
    
    // Get daily booking counts
    const dailyBookings = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } }
    ])
    
    // For detailed reports, include booking data
    let bookings = []
    if (type === "detailed") {
      bookings = await Appointment.find(dateFilter)
        .sort({ date: -1 })
        .limit(100) // Limit to prevent large responses
    }
    
    res.json({
      totalBookings,
      approvedBookings,
      pendingBookings,
      rejectedBookings,
      notificationsSent,
      serviceDistribution: {
        hair: hairBookings,
        skin: skinBookings,
        bridal: bridalBookings,
        nails: nailsBookings,
      },
      dailyBookings,
      bookings: type === "detailed" ? bookings : []
    })
  } catch (err) {
    console.error("Analytics error:", err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST /api/admin/analytics/pdf
// @desc    Generate PDF report
// @access  Private
router.post("/analytics/pdf", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query
    
    // Parse dates
    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1))
    const end = endDate ? new Date(endDate) : new Date()
    
    // Set end date to end of day
    end.setHours(23, 59, 59, 999)
    
    // Build date filter
    const dateFilter = {
      date: {
        $gte: start,
        $lte: end
      }
    }
    
    // Get counts for dashboard
    const totalBookings = await Appointment.countDocuments(dateFilter)
    const approvedBookings = await Appointment.countDocuments({ ...dateFilter, status: "approved" })
    const pendingBookings = await Appointment.countDocuments({ ...dateFilter, status: "pending" })
    const rejectedBookings = await Appointment.countDocuments({ ...dateFilter, status: "rejected" })
    
    // Get service distribution
    const hairBookings = await Appointment.countDocuments({ ...dateFilter, service: "hair" })
    const skinBookings = await Appointment.countDocuments({ ...dateFilter, service: "skin" })
    const bridalBookings = await Appointment.countDocuments({ ...dateFilter, service: "bridal" })
    const nailsBookings = await Appointment.countDocuments({ ...dateFilter, service: "nails" })
    
    // For detailed reports, include booking data
    let bookings = []
    if (type === "detailed") {
      bookings = await Appointment.find(dateFilter)
        .sort({ date: -1 })
        .limit(50) // Limit to prevent large PDFs
    }
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50 })
    
    // Set response headers
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename=parlor-analytics-${format(new Date(), "yyyy-MM-dd")}.pdf`)
    
    // Pipe PDF to response
    doc.pipe(res)
    
    // Add content to PDF
    doc.fontSize(25).text("Parlor Booking Analytics", { align: "center" })
    doc.moveDown()
    
    doc.fontSize(14).text(`Report Period: ${format(start, "MMM d, yyyy")} to ${format(end, "MMM d, yyyy")}`, { align: "center" })
    doc.moveDown(2)
    
    // Summary section
    doc.fontSize(18).text("Booking Summary", { underline: true })
    doc.moveDown()
    
    doc.fontSize(12)
    doc.text(`Total Bookings: ${totalBookings}`)
    doc.text(`Approved Bookings: ${approvedBookings}`)
    doc.text(`Pending Bookings: ${pendingBookings}`)
    doc.text(`Rejected Bookings: ${rejectedBookings}`)
    doc.moveDown()
    
    // Service distribution section
    doc.fontSize(18).text("Service Distribution", { underline: true })
    doc.moveDown()
    
    doc.fontSize(12)
    doc.text(`Hair Services: ${hairBookings} (${((hairBookings / totalBookings) * 100).toFixed(1)}%)`)
    doc.text(`Skin Services: ${skinBookings} (${((skinBookings / totalBookings) * 100).toFixed(1)}%)`)
    doc.text(`Bridal Services: ${bridalBookings} (${((bridalBookings / totalBookings) * 100).toFixed(1)}%)`)
    doc.text(`Nail Services: ${nailsBookings} (${((nailsBookings / totalBookings) * 100).toFixed(1)}%)`)
    doc.moveDown(2)
    
    // Add detailed bookings if requested
    if (type === "detailed" && bookings.length > 0) {
      doc.fontSize(18).text("Detailed Booking Information", { underline: true })
      doc.moveDown()
      
      // Table header
      const tableTop = doc.y
      const tableHeaders = ["Name", "Service", "Date", "Status"]
      const columnWidth = (doc.page.width - 100) / tableHeaders.length
      
      // Draw header
      doc.fontSize(10).font("Helvetica-Bold")
      tableHeaders.forEach((header, i) => {
        doc.text(header, 50 + (i * columnWidth), tableTop, { width: columnWidth, align: "left" })
      })
      
      // Draw rows
      doc.font("Helvetica")
      let rowTop = tableTop + 20
      
      bookings.forEach((booking, index) => {
        // Check if we need a new page
        if (rowTop > doc.page.height - 100) {
          doc.addPage()
          rowTop = 50
          
          // Redraw header on new page
          doc.fontSize(10).font("Helvetica-Bold")
          tableHeaders.forEach((header, i) => {
            doc.text(header, 50 + (i * columnWidth), rowTop, { width: columnWidth, align: "left" })
          })
          doc.font("Helvetica")
          rowTop += 20
        }
        
        // Format date
        const bookingDate = format(new Date(booking.date), "MMM d, yyyy")
        
        // Draw row
        doc.text(booking.name, 50, rowTop, { width: columnWidth, align: "left" })
        doc.text(booking.service.charAt(0).toUpperCase() + booking.service.slice(1), 50 + columnWidth, rowTop, { width: columnWidth, align: "left" })
        doc.text(bookingDate, 50 + (2 * columnWidth), rowTop, { width: columnWidth, align: "left" })
        doc.text(booking.status.charAt(0).toUpperCase() + booking.status.slice(1), 50 + (3 * columnWidth), rowTop, { width: columnWidth, align: "left" })
        
        rowTop += 20
      })
    }
    
    // Finalize PDF
    doc.end()
  } catch (err) {
    console.error("PDF generation error:", err.message)
    res.status(500).send("Error generating PDF report")
  }
})

module.exports = router
