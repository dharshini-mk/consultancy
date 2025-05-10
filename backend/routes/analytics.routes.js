const express = require("express")
const router = express.Router()
const Appointment = require("../models/Appointment")
const authMiddleware = require("../middleware/auth.mw")
const PDFDocument = require("pdfkit")

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, type = "summary" } = req.query

    // Build date filter
    const dateFilter = {}
    if (startDate) {
      dateFilter.$gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate)
    }

    // Build filter object
    const filter = {}
    if (Object.keys(dateFilter).length > 0) {
      filter.date = dateFilter
    }

    // Get counts for analytics
    const totalBookings = await Appointment.countDocuments(filter)
    const approvedBookings = await Appointment.countDocuments({ ...filter, status: "approved" })
    const pendingBookings = await Appointment.countDocuments({ ...filter, status: "pending" })
    const rejectedBookings = await Appointment.countDocuments({ ...filter, status: "rejected" })
    const notificationsSent = await Appointment.countDocuments({
      ...filter,
      "whatsappNotification.sent": true,
    })

    // Get service distribution
    const hairBookings = await Appointment.countDocuments({ ...filter, service: "hair" })
    const skinBookings = await Appointment.countDocuments({ ...filter, service: "skin" })
    const bridalBookings = await Appointment.countDocuments({ ...filter, service: "bridal" })
    const nailsBookings = await Appointment.countDocuments({ ...filter, service: "nails" })

    // Get daily bookings data for trend chart
    const dailyBookings = await Appointment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } },
    ])

    // For detailed reports, include booking data
    let bookings = []
    if (type === "detailed") {
      bookings = await Appointment.find(filter)
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
      bookings: type === "detailed" ? bookings : [],
    })
  } catch (err) {
    console.error("Analytics error:", err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST /api/admin/analytics/pdf
// @desc    Generate PDF report
// @access  Private
router.post("/pdf", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, type = "summary" } = req.query

    // Build date filter
    const dateFilter = {}
    if (startDate) {
      dateFilter.$gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate)
    }

    // Build filter object
    const filter = {}
    if (Object.keys(dateFilter).length > 0) {
      filter.date = dateFilter
    }

    // Get analytics data
    const totalBookings = await Appointment.countDocuments(filter)
    const approvedBookings = await Appointment.countDocuments({ ...filter, status: "approved" })
    const pendingBookings = await Appointment.countDocuments({ ...filter, status: "pending" })
    const rejectedBookings = await Appointment.countDocuments({ ...filter, status: "rejected" })

    // Get service distribution
    const hairBookings = await Appointment.countDocuments({ ...filter, service: "hair" })
    const skinBookings = await Appointment.countDocuments({ ...filter, service: "skin" })
    const bridalBookings = await Appointment.countDocuments({ ...filter, service: "bridal" })
    const nailsBookings = await Appointment.countDocuments({ ...filter, service: "nails" })

    // Get bookings for detailed report
    let bookings = []
    if (type === "detailed") {
      bookings = await Appointment.find(filter).sort({ date: -1 }).limit(100)
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 })

    // Set response headers
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=parlor-analytics-${new Date().toISOString().split("T")[0]}.pdf`
    )

    // Pipe PDF to response
    doc.pipe(res)

    // Add content to PDF
    doc
      .fontSize(25)
      .text("Parlor Booking Analytics Report", { align: "center" })
      .moveDown(0.5)

    // Add date range
    doc
      .fontSize(12)
      .text(
        `Date Range: ${startDate ? new Date(startDate).toLocaleDateString() : "All time"} to ${
          endDate ? new Date(endDate).toLocaleDateString() : "Present"
        }`,
        { align: "center" }
      )
      .moveDown(1)

    // Add summary statistics
    doc.fontSize(16).text("Booking Summary", { underline: true }).moveDown(0.5)

    doc.fontSize(12).text(`Total Bookings: ${totalBookings}`).moveDown(0.25)
    doc.text(`Approved Bookings: ${approvedBookings}`).moveDown(0.25)
    doc.text(`Pending Bookings: ${pendingBookings}`).moveDown(0.25)
    doc.text(`Rejected Bookings: ${rejectedBookings}`).moveDown(1)

    // Add service distribution
    doc.fontSize(16).text("Service Distribution", { underline: true }).moveDown(0.5)

    doc.fontSize(12).text(`Hair Services: ${hairBookings}`).moveDown(0.25)
    doc.text(`Skin Services: ${skinBookings}`).moveDown(0.25)
    doc.text(`Bridal Services: ${bridalBookings}`).moveDown(0.25)
    doc.text(`Nail Services: ${nailsBookings}`).moveDown(1)

    // Add detailed booking list if requested
    if (type === "detailed" && bookings.length > 0) {
      doc.addPage()
      doc.fontSize(16).text("Detailed Booking List", { underline: true }).moveDown(0.5)

      // Table header
      const tableTop = doc.y + 10
      const tableHeaders = ["Name", "Service", "Date", "Time", "Status"]
      const columnWidth = 100

      // Draw headers
      doc.fontSize(10)
      tableHeaders.forEach((header, i) => {
        doc.text(header, 50 + i * columnWidth, tableTop, { width: columnWidth, align: "left" })
      })

      // Draw line under headers
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke()

      // Draw rows
      let rowTop = tableTop + 25
      bookings.forEach((booking, index) => {
        // Add new page if needed
        if (rowTop > 700) {
          doc.addPage()
          rowTop = 50
        }

        doc.fontSize(9)
        doc.text(booking.name, 50, rowTop, { width: columnWidth, align: "left" })
        doc.text(
          booking.service.charAt(0).toUpperCase() + booking.service.slice(1),
          50 + columnWidth,
          rowTop,
          { width: columnWidth, align: "left" }
        )
        doc.text(new Date(booking.date).toLocaleDateString(), 50 + columnWidth * 2, rowTop, {
          width: columnWidth,
          align: "left",
        })
        doc.text(booking.time, 50 + columnWidth * 3, rowTop, { width: columnWidth, align: "left" })
        doc.text(
          booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
          50 + columnWidth * 4,
          rowTop,
          { width: columnWidth, align: "left" }
        )

        rowTop += 20
      })
    }

    // Add footer
    const pageCount = doc.bufferedPageRange().count
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i)
      doc
        .fontSize(8)
        .text(
          `Generated on ${new Date().toLocaleString()} - Page ${i + 1} of ${pageCount}`,
          50,
          doc.page.height - 50,
          { align: "center" }
        )
    }

    // Finalize PDF
    doc.end()
  } catch (err) {
    console.error("PDF generation error:", err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
