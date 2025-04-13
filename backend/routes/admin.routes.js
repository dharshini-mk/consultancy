const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs") // Add this import
const Admin = require("../models/Admin")
const Appointment = require("../models/Appointment")
const authMiddleware = require("../middleware/auth.mw")
const { sendWhatsAppMessage } = require("../utils/whatsapp")

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
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Update status
    appointment.status = "approved"
    await appointment.save()

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
      console.error("WhatsApp notification error:", whatsappError)

      // Still update the appointment status but mark notification as failed
      appointment.whatsappNotification.sent = false
      await appointment.save()

      // Notify all connected clients
      req.io.emit("booking-updated", appointment)

      res.json({
        appointment,
        whatsappError: "Failed to send WhatsApp notification. You can retry later.",
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

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

module.exports = router
