"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faLock, faSignInAlt } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import { showSuccess, showError } from "../utils/notifications"
import "../styles/auth.css"

const AdminLogin = ({ setToken }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.username || !formData.password) {
      showError("Please enter both username and password")
      return
    }

    setLoading(true)

    try {
      // Submit login request
      const response = await axios.post("/api/admin/login", formData)

      // Store token in localStorage
      localStorage.setItem("adminToken", response.data.token)

      // Update token in parent component
      setToken(response.data.token)

      showSuccess("Login successful")

      // Redirect to admin dashboard
      navigate("/admin/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      showError(error.response?.data?.message || "Login failed")
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
    <div className="auth-container">
      <motion.div className="auth-form-wrapper" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="auth-logo" variants={itemVariants}>
          <h1>Thenu's Makeover</h1>
          <p>Admin Portal</p>
        </motion.div>

        <motion.h2 variants={itemVariants}>Admin Login</motion.h2>
        <motion.p variants={itemVariants}>Enter your credentials to access the admin dashboard</motion.p>

        <motion.form onSubmit={handleSubmit} className="auth-form" variants={containerVariants}>
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="username">
              <FontAwesomeIcon icon={faUser} /> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="submit-btn"
            disabled={loading}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} /> Login
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default AdminLogin
