"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { showSuccess, showError, showInfo, showWarning } from "../../utils/notifications"
import WhatsAppService from "../../utils/whatsapp"
import "./SlotManager.css"

const SlotManager = ({ token, socket }) => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    date: "",
    service: "",
    status: "",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [processingBooking, setProcessingBooking] = useState(null)

  // Fetch bookings with filters and pagination
  const fetchBookings = async () => {
    setLoading(true)

    try {
      const response = await axios.get("/api/admin/bookings", {
        params: {
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        },
        headers: {
          "x-auth-token": token,
        },
      })

      setBookings(response.data.bookings)
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      }))
    } catch (error) {
      console.error("Error fetching bookings:", error)
      showError("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, pagination.limit])

  // Socket.io event listeners
  useEffect(() => {
    if (socket) {
      // Listen for new bookings
      socket.on("new-booking", (newBooking) => {
        setBookings((prev) => [newBooking, ...prev])
        showInfo("New booking received!")
      })

      // Listen for booking updates
      socket.on("booking-updated", (updatedBooking) => {
        setBookings((prev) => prev.map((booking) => (booking._id === updatedBooking._id ? updatedBooking : booking)))
      })

      return () => {
        socket.off("new-booking")
        socket.off("booking-updated")
      }
    }
  }, [socket])

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setPagination((prev) => ({ ...prev, page: 1 })) // Reset to first page on filter change
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }))
    }
  }

  // Approve booking
  const handleApprove = async (id) => {
    setProcessingBooking(id)

    try {
      const response = await axios.put(
        `/api/admin/bookings/${id}/approve`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        },
      )

      // Update booking in state
      setBookings((prev) => prev.map((booking) => (booking._id === id ? response.data.appointment : booking)))

      showSuccess("Booking approved successfully")

      // Show WhatsApp notification status
      if (response.data.smsResult) {
        showSuccess("SMS notification sent successfully")
      } else {
        showWarning("Booking approved, but SMS notification failed. You can retry later.")
      }
      
    } catch (error) {
      console.error("Error approving booking:", error)
      showError(error.response?.data?.message || "Failed to approve booking")
    } finally {
      setProcessingBooking(null)
    }
  }

  // Reject booking
  const handleReject = async (id) => {
    setProcessingBooking(id)

    try {
      const response = await axios.put(
        `/api/admin/bookings/${id}/reject`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        },
      )

      // Update booking in state
      setBookings((prev) => prev.map((booking) => (booking._id === id ? response.data.appointment : booking)))

      showSuccess("Booking rejected successfully")
    } catch (error) {
      console.error("Error rejecting booking:", error)
      showError(error.response?.data?.message || "Failed to reject booking")
    } finally {
      setProcessingBooking(null)
    }
  }

  // Retry WhatsApp notification
 // Retry SMS notification
const handleRetrySMS = async (id) => {
  setProcessingBooking(id)

  try {
    const response = await axios.post(
      `/api/admin/bookings/${id}/retry-sms`,
      {},
      {
        headers: {
          "x-auth-token": token,
        },
      }
    )

    // Optionally update local booking data
    fetchBookings()

    showSuccess("SMS notification retried successfully")
  } catch (error) {
    console.error("Error retrying SMS notification:", error)
    showError(error.response?.data?.message || "Failed to retry SMS notification")
  } finally {
    setProcessingBooking(null)
  }
}


  // Export bookings as CSV
  const handleExport = () => {
    // Create URL with current filters
    const queryParams = new URLSearchParams({
      ...filters,
    }).toString()

    // Create download link
    const downloadUrl = `/api/admin/export?${queryParams}`

    // Create temporary link and trigger download
    const link = document.createElement("a")
    link.href = downloadUrl
    link.setAttribute("download", "bookings.csv")

    // Add auth header using fetch
    fetch(downloadUrl, {
      headers: {
        "x-auth-token": token,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      .catch((error) => {
        console.error("Error exporting bookings:", error)
        showError("Failed to export bookings")
      })
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="slot-manager">
      <div className="slot-manager-header">
        <h2>Appointment Manager</h2>
        <button className="export-btn" onClick={handleExport}>
          Export to CSV
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="date-filter">Date</label>
          <input type="date" id="date-filter" name="date" value={filters.date} onChange={handleFilterChange} />
        </div>

        <div className="filter-group">
          <label htmlFor="service-filter">Service</label>
          <select id="service-filter" name="service" value={filters.service} onChange={handleFilterChange}>
            <option value="">All Services</option>
            <option value="hair">Hair</option>
            <option value="skin">Skin</option>
            <option value="bridal">Bridal</option>
            <option value="nails">Nails</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select id="status-filter" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">No bookings found</div>
      ) : (
        <>
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>WhatsApp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{booking.name}</div>
                        <div className="customer-contact">
                          <span>{booking.email}</span>
                          <span>{booking.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`service-badge ${booking.service}`}>
                        {booking.service.charAt(0).toUpperCase() + booking.service.slice(1)}
                      </span>
                    </td>
                    <td>{formatDate(booking.date)}</td>
                    <td>{booking.time}</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td>
  {booking.status === "approved" && (
    <span className={`sms-status ${booking.smsNotification?.sent ? "sent" : "failed"}`}>
      {booking.smsNotification?.sent ? "Sent" : "Failed"}
    </span>
  )}
</td>

                    <td>
                      <div className="action-buttons">
                        {booking.status === "pending" && (
                          <>
                            <button
                              className="approve-btn"
                              onClick={() => handleApprove(booking._id)}
                              disabled={processingBooking === booking._id}
                            >
                              {processingBooking === booking._id ? "Processing..." : "Approve"}
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleReject(booking._id)}
                              disabled={processingBooking === booking._id}
                            >
                              {processingBooking === booking._id ? "Processing..." : "Reject"}
                            </button>
                          </>
                        )}

{booking.status === "approved" && !booking.smsNotification?.sent && (
  <button
    className="retry-btn"
    onClick={() => handleRetrySMS(booking._id)} // <-- change this if needed
    disabled={processingBooking === booking._id}
  >
    {processingBooking === booking._id ? "Sending..." : "Retry SMS"}
  </button>
)}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default SlotManager
