"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { io } from "socket.io-client"
import { showError } from "../utils/notifications"
import SlotManager from "./Appointment/SlotManager"
import "../styles/admin.css"

const AdminPanel = ({ token, setToken }) => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState(null)

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io()
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard", {
          headers: {
            "x-auth-token": token,
          },
        })

        setDashboardData(response.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)

        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken")
          setToken(null)
          navigate("/admin/login")
        } else {
          showError("Failed to load dashboard data")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token, navigate, setToken])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setToken(null)
    navigate("/admin/login")
  }

  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card total">
          <h3>Total Bookings</h3>
          <div className="stat-value">{dashboardData?.totalBookings || 0}</div>
        </div>

        <div className="stat-card pending">
          <h3>Pending</h3>
          <div className="stat-value">{dashboardData?.pendingBookings || 0}</div>
        </div>

        <div className="stat-card approved">
          <h3>Approved</h3>
          <div className="stat-value">{dashboardData?.approvedBookings || 0}</div>
        </div>

        <div className="stat-card rejected">
          <h3>Rejected</h3>
          <div className="stat-value">{dashboardData?.rejectedBookings || 0}</div>
        </div>
      </div>

      <div className="service-distribution">
        <h3>Service Distribution</h3>
        <div className="distribution-bars">
          <div className="service-bar">
            <div className="service-label">Hair</div>
            <div className="bar-container">
              <div
                className="bar hair"
                style={{
                  width: `${
                    dashboardData?.totalBookings
                      ? (dashboardData.serviceDistribution.hair / dashboardData.totalBookings) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="service-count">{dashboardData?.serviceDistribution.hair || 0}</div>
          </div>

          <div className="service-bar">
            <div className="service-label">Skin</div>
            <div className="bar-container">
              <div
                className="bar skin"
                style={{
                  width: `${
                    dashboardData?.totalBookings
                      ? (dashboardData.serviceDistribution.skin / dashboardData.totalBookings) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="service-count">{dashboardData?.serviceDistribution.skin || 0}</div>
          </div>

          <div className="service-bar">
            <div className="service-label">Bridal</div>
            <div className="bar-container">
              <div
                className="bar bridal"
                style={{
                  width: `${
                    dashboardData?.totalBookings
                      ? (dashboardData.serviceDistribution.bridal / dashboardData.totalBookings) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="service-count">{dashboardData?.serviceDistribution.bridal || 0}</div>
          </div>

          <div className="service-bar">
            <div className="service-label">Nails</div>
            <div className="bar-container">
              <div
                className="bar nails"
                style={{
                  width: `${
                    dashboardData?.totalBookings
                      ? (dashboardData.serviceDistribution.nails / dashboardData.totalBookings) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="service-count">{dashboardData?.serviceDistribution.nails || 0}</div>
          </div>
        </div>
      </div>

      <div className="notification-stats">
        <div className="stat-card">
          <h3>WhatsApp Notifications</h3>
          <div className="stat-value">{dashboardData?.notificationsSent || 0}</div>
          <div className="stat-label">Successfully Sent</div>
        </div>
      </div>

      <SlotManager token={token} socket={socket} />
    </div>
  )
}

export default AdminPanel
