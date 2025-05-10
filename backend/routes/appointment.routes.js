const express = require("express")
const router = express.Router()
const Appointment = require("../models/Appointment")

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, service, date, time } = req.body

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      time,
      service,
      status: { $ne: "rejected" }, // Exclude rejected appointments
    })

    if (existingAppointment) {
      return res.status(400).json({ message: "This slot is already booked" })
    }

    // Create new appointment
    const appointment = new Appointment({
      name,
      email,
      phone,
      service,
      date: new Date(date),
      time,
    })

    await appointment.save()

    // Notify all connected clients about new booking
    req.io.emit("new-booking", appointment)

    res.status(201).json(appointment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET /api/appointments/available-slots
// @desc    Get available slots for a specific date and service
// @access  Public
router.get("/available-slots", async (req, res) => {
  try {
    const { date, service } = req.query

    if (!date || !service) {
      return res.status(400).json({ message: "Date and service are required" })
    }

    // Define all possible time slots
    const allTimeSlots = [
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
      "5:00 PM",
      "5:30 PM",
      "6:00 PM",
      "6:30 PM",
      "7:00 PM",
    ]

    // Find booked slots
    const bookedAppointments = await Appointment.find({
      date: new Date(date),
      service,
      status: { $ne: "rejected" }, // Exclude rejected appointments
    })

    const bookedTimeSlots = bookedAppointments.map((appointment) => appointment.time)

    // Filter out booked slots
    const availableTimeSlots = allTimeSlots.filter((slot) => !bookedTimeSlots.includes(slot))

    res.json(availableTimeSlots)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    res.json(appointment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
