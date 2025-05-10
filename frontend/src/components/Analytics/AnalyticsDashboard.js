import React, { useState, useEffect } from "react"
import axios from "axios"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js"
import { Bar, Pie, Line } from "react-chartjs-2"
import { saveAs } from "file-saver"
import { utils, write } from "xlsx"
import "./Analytics.css"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

const AnalyticsDashboard = ({ token }) => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })
  const [reportType, setReportType] = useState("summary")

  useEffect(() => {
    fetchAnalyticsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, reportType])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/admin/analytics", {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          type: reportType,
        },
        headers: {
          "x-auth-token": token,
        },
      })
      setAnalyticsData(response.data)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value)
  }

  const downloadExcel = () => {
    if (!analyticsData) return

    // Create workbook and worksheet
    const wb = utils.book_new()
    
    // Create summary worksheet
    const summaryData = [
      ["Booking Analytics Report", "", ""],
      ["Date Range", `${dateRange.startDate} to ${dateRange.endDate}`, ""],
      ["", "", ""],
      ["Total Bookings", analyticsData.totalBookings, ""],
      ["Approved Bookings", analyticsData.approvedBookings, ""],
      ["Pending Bookings", analyticsData.pendingBookings, ""],
      ["Rejected Bookings", analyticsData.rejectedBookings, ""],
      ["", "", ""],
      ["Service Distribution", "", ""],
      ["Hair", analyticsData.serviceDistribution.hair, ""],
      ["Skin", analyticsData.serviceDistribution.skin, ""],
      ["Bridal", analyticsData.serviceDistribution.bridal, ""],
      ["Nails", analyticsData.serviceDistribution.nails, ""],
    ]
    
    const summaryWs = utils.aoa_to_sheet(summaryData)
    utils.book_append_sheet(wb, summaryWs, "Summary")
    
    // Create bookings worksheet if detailed data is available
    if (analyticsData.bookings && analyticsData.bookings.length > 0) {
      // Convert bookings to worksheet data
      const bookingsData = [
        ["Name", "Email", "Phone", "Service", "Date", "Time", "Status", "WhatsApp Notification"]
      ]
      
      analyticsData.bookings.forEach(booking => {
        bookingsData.push([
          booking.name,
          booking.email,
          booking.phone,
          booking.service,
          new Date(booking.date).toLocaleDateString(),
          booking.time,
          booking.status,
          booking.whatsappNotification.sent ? "Sent" : "Not Sent"
        ])
      })
      
      const bookingsWs = utils.aoa_to_sheet(bookingsData)
      utils.book_append_sheet(wb, bookingsWs, "Bookings")
    }
    
    // Generate Excel file
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    
    // Save file
    saveAs(data, `parlor-analytics-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const downloadPDF = () => {
    // Redirect to PDF generation endpoint
    const url = `/api/admin/analytics/pdf?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&type=${reportType}`
    
    // Create a hidden form to submit as POST with token
    const form = document.createElement("form")
    form.method = "POST"
    form.action = url
    form.target = "_blank"
    
    const tokenInput = document.createElement("input")
    tokenInput.type = "hidden"
    tokenInput.name = "token"
    tokenInput.value = token
    
    form.appendChild(tokenInput)
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  if (loading) {
    return <div className="analytics-loading">Loading analytics data...</div>
  }

  if (!analyticsData) {
    return <div className="analytics-error">Failed to load analytics data</div>
  }

  // Prepare chart data
  const serviceChartData = {
    labels: ["Hair", "Skin", "Bridal", "Nails"],
    datasets: [
      {
        label: "Service Distribution",
        data: [
          analyticsData.serviceDistribution.hair,
          analyticsData.serviceDistribution.skin,
          analyticsData.serviceDistribution.bridal,
          analyticsData.serviceDistribution.nails,
        ],
        backgroundColor: ["#007bff", "#28a745", "#dc3545", "#6f42c1"],
      },
    ],
  }

  const statusChartData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        label: "Booking Status",
        data: [
          analyticsData.approvedBookings,
          analyticsData.pendingBookings,
          analyticsData.rejectedBookings,
        ],
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
      },
    ],
  }

  // Daily bookings chart data (if available)
  const dailyBookingsData = analyticsData.dailyBookings
    ? {
        labels: analyticsData.dailyBookings.map((item) => item.date),
        datasets: [
          {
            label: "Daily Bookings",
            data: analyticsData.dailyBookings.map((item) => item.count),
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.2)",
            tension: 0.4,
          },
        ],
      }
    : null

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Booking Analytics</h2>
        <div className="analytics-controls">
          <div className="date-range-controls">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                max={dateRange.endDate}
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                min={dateRange.startDate}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <div className="report-type-control">
            <label htmlFor="reportType">Report Type</label>
            <select id="reportType" value={reportType} onChange={handleReportTypeChange}>
              <option value="summary">Summary</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
        </div>
        <div className="export-controls">
          <button className="export-btn excel" onClick={downloadExcel}>
            Export to Excel
          </button>
          <button className="export-btn pdf" onClick={downloadPDF}>
            Export to PDF
          </button>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-card total">
          <h3>Total Bookings</h3>
          <div className="summary-value">{analyticsData.totalBookings}</div>
        </div>
        <div className="summary-card approved">
          <h3>Approved</h3>
          <div className="summary-value">{analyticsData.approvedBookings}</div>
        </div>
        <div className="summary-card pending">
          <h3>Pending</h3>
          <div className="summary-value">{analyticsData.pendingBookings}</div>
        </div>
        <div className="summary-card rejected">
          <h3>Rejected</h3>
          <div className="summary-value">{analyticsData.rejectedBookings}</div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-container">
          <h3>Service Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={serviceChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart-container">
          <h3>Booking Status</h3>
          <div className="chart-wrapper">
            <Bar
              data={statusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {dailyBookingsData && (
        <div className="chart-container full-width">
          <h3>Booking Trends</h3>
          <div className="chart-wrapper">
            <Line
              data={dailyBookingsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {reportType === "detailed" && analyticsData.bookings && (
        <div className="detailed-data">
          <h3>Detailed Booking Data</h3>
          <div className="table-container">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.name}</td>
                    <td>
                      <span className={`service-badge ${booking.service}`}>
                        {booking.service.charAt(0).toUpperCase() + booking.service.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>{booking.time}</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {booking.status === "approved" && (
                        <span className={`whatsapp-status ${booking.whatsappNotification.sent ? "sent" : "failed"}`}>
                          {booking.whatsappNotification.sent ? "Sent" : "Failed"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsDashboard
