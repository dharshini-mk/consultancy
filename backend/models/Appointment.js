const mongoose = require("mongoose")

const AppointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
    enum: ["hair", "skin", "bridal", "nails"],
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  whatsappNotification: {
    sent: {
      type: Boolean,
      default: false,
    },
    timestamp: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create index for faster queries
AppointmentSchema.index({ date: 1, time: 1, service: 1 })

module.exports = mongoose.model("Appointment", AppointmentSchema)
