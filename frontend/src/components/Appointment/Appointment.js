"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import DatePicker from "react-datepicker"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarAlt, faUser, faEnvelope, faPhone, faClock, faCheck } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import { showSuccess, showError } from "../../utils/notifications"
import useSlots from "./useSlots"
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import "react-datepicker/dist/react-datepicker.css"
import "./Appointment.css"

// Import images
import appointmentBg from "../../assets/images/appointment-bg.jpeg"

const Appointment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: location.state?.selectedService || "",
    date: "",
    time: "",
  })

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [services] = useState([
    { id: "hair", name: "Hair Services", icon: "cut" },
    { id: "skin", name: "Skin Care", icon: "spa" },
    { id: "bridal", name: "Bridal Services", icon: "gem" },
    { id: "nails", name: "Nail Art", icon: "paint-brush" },
  ])

  // Use custom hook for slot management
  const { availableSlots, fetchAvailableSlots, isLoadingSlots } = useSlots()

  // Set minimum date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  useEffect(() => {
    // If service is pre-selected from another page, move to step 2
    if (location.state?.selectedService) {
      setStep(2)
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [location.state])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // If date or service changes, fetch available slots
    if (name === "date" || name === "service") {
      if ((formData.service && name === "date") || (formData.date && name === "service")) {
        const serviceValue = name === "service" ? value : formData.service
        const dateValue = name === "date" ? value : formData.date

        fetchAvailableSlots(dateValue, serviceValue)
      }
    }
  }

  // Handle date change from DatePicker
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]
      setFormData((prev) => ({ ...prev, date: formattedDate }))

      if (formData.service) {
        fetchAvailableSlots(formattedDate, formData.service)
      }
    }
  }

  // Handle service selection
  const handleServiceSelect = (serviceId) => {
    setFormData((prev) => ({ ...prev, service: serviceId }))
    setStep(2)

    if (formData.date) {
      fetchAvailableSlots(formData.date, serviceId)
    }
  }

  // Handle time slot selection
  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, time }))
    setStep(3)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time) {
      showError("Please fill in all fields")
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showError("Please enter a valid email address")
      return
    }

    // Validate phone (10 digits)
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.phone)) {
      showError("Please enter a valid 10-digit phone number")
      return
    }

    setLoading(true)

    try {
      // Submit appointment
      const response = await axios.post("/api/appointments", formData)

      showSuccess("Appointment booked successfully! We will notify you once it is approved.")

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        time: "",
      })

      // Redirect to confirmation page
      navigate(`/confirmation/${response.data._id}`)
    } catch (error) {
      console.error("Booking error:", error)
      showError(error.response?.data?.message || "Failed to book appointment")
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <>
      <Navbar />
      <div className="appointment-page">
        <div className="appointment-hero" style={{ backgroundImage: `url(${appointmentBg})` }}>
          <div className="appointment-hero-content">
            <h1>Book Your Appointment</h1>
            <p>Schedule your beauty session with our expert team</p>
          </div>
        </div>

        <div className="appointment-container">
          <div className="appointment-steps">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <div className="step-text">Select Service</div>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-text">Choose Date & Time</div>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <div className="step-text">Your Details</div>
            </div>
          </div>

          <div className="appointment-form-wrapper">
            {step === 1 && (
              <motion.div
                className="step-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2>Select a Service</h2>
                <p>Choose the service you'd like to book</p>

                <div className="services-grid">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      className={`service-option ${formData.service === service.id ? "selected" : ""}`}
                      onClick={() => handleServiceSelect(service.id)}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FontAwesomeIcon icon={service.icon} className="service-icon" />
                      <h3>{service.name}</h3>
                      {formData.service === service.id && (
                        <div className="selected-indicator">
                          <FontAwesomeIcon icon={faCheck} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                className="step-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2>Choose Date & Time</h2>
                <p>Select your preferred appointment date and time</p>

                <motion.div className="date-time-container" variants={itemVariants}>
                  <div className="date-picker-container">
                    <label>
                      <FontAwesomeIcon icon={faCalendarAlt} /> Select Date
                    </label>
                    <DatePicker
                      selected={formData.date ? new Date(formData.date) : null}
                      onChange={handleDateChange}
                      minDate={tomorrow}
                      placeholderText="Select a date"
                      className="date-picker"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>

                  <div className="time-slots-container">
                    <label>
                      <FontAwesomeIcon icon={faClock} /> Available Time Slots
                    </label>
                    {isLoadingSlots ? (
                      <div className="loading-slots">Loading available slots...</div>
                    ) : !formData.date ? (
                      <div className="no-slots-message">Please select a date first</div>
                    ) : availableSlots.length === 0 ? (
                      <div className="no-slots-message">No slots available for the selected date</div>
                    ) : (
                      <div className="time-slots-grid">
                        {availableSlots.map((slot) => (
                          <motion.div
                            key={slot}
                            className={`time-slot ${formData.time === slot ? "selected" : ""}`}
                            onClick={() => handleTimeSelect(slot)}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {slot}
                            {formData.time === slot && (
                              <div className="selected-indicator">
                                <FontAwesomeIcon icon={faCheck} />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="step-buttons">
                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setStep(3)}
                      disabled={!formData.date || !formData.time}
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                className="step-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2>Your Details</h2>
                <p>Please provide your contact information</p>

                <motion.form onSubmit={handleSubmit} className="appointment-form" variants={itemVariants}>
                  <div className="form-group">
                    <label htmlFor="name">
                      <FontAwesomeIcon icon={faUser} /> Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <FontAwesomeIcon icon={faEnvelope} /> Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <FontAwesomeIcon icon={faPhone} /> Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your 10-digit phone number"
                      required
                    />
                  </div>

                  <div className="booking-summary">
                    <h3>Booking Summary</h3>
                    <div className="summary-item">
                      <span className="summary-label">Service:</span>
                      <span className="summary-value">{services.find((s) => s.id === formData.service)?.name}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Date:</span>
                      <span className="summary-value">
                        {formData.date &&
                          new Date(formData.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Time:</span>
                      <span className="summary-value">{formData.time}</span>
                    </div>
                  </div>

                  <div className="step-buttons">
                    <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Booking..." : "Confirm Booking"}
                    </button>
                  </div>
                </motion.form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Appointment
