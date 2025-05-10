"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faCalendarAlt, faClock, faCut, faSpinner } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import "./AppointmentConfirmation.css"

const AppointmentConfirmation = () => {
  const { id } = useParams()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`/api/appointments/${id}`)
        setAppointment(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching appointment:", err)
        setError("Unable to load appointment details. Please try again later.")
        setLoading(false)
      }
    }

    fetchAppointment()
    window.scrollTo(0, 0)
  }, [id])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
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

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Get service name
  const getServiceName = (serviceId) => {
    const services = {
      hair: "Hair Services",
      skin: "Skin Care",
      bridal: "Bridal Services",
      nails: "Nail Art",
    }
    return services[serviceId] || serviceId
  }

  return (
    <>
      <Navbar />
      <div className="confirmation-page">
        {loading ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p>Loading appointment details...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <Link to="/appointment" className="btn btn-primary">
              Book Again
            </Link>
          </div>
        ) : (
          <motion.div
            className="confirmation-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="confirmation-header" variants={itemVariants}>
              <div className="confirmation-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <h1>Booking Confirmed!</h1>
              <p>Your appointment has been successfully booked and is awaiting approval.</p>
            </motion.div>

            <motion.div className="confirmation-details" variants={itemVariants}>
              <h2>Appointment Details</h2>

              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div className="detail-content">
                    <h3>Date</h3>
                    <p>{formatDate(appointment.date)}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                  <div className="detail-content">
                    <h3>Time</h3>
                    <p>{appointment.time}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FontAwesomeIcon icon={faCut} />
                  </div>
                  <div className="detail-content">
                    <h3>Service</h3>
                    <p>{getServiceName(appointment.service)}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="confirmation-message" variants={itemVariants}>
              <h3>What's Next?</h3>
              <p>
                We'll review your booking request and send you a confirmation via WhatsApp once it's approved. You'll
                receive a message at <strong>{appointment.phone}</strong>.
              </p>
              <p>
                If you need to make any changes to your appointment, please contact us at{" "}
                <a href="tel:+919092626262">+91 90926 26262</a>.
              </p>
            </motion.div>

            <motion.div className="confirmation-actions" variants={itemVariants}>
              <Link to="/" className="btn btn-outline">
                Return to Home
              </Link>
              <Link to="/services/hair" className="btn btn-primary">
                Explore Our Services
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default AppointmentConfirmation
