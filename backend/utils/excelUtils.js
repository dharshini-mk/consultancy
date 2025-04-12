/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @returns {String} CSV string
 */
const convertToCSV = (data) => {
  if (!data || !data.length) {
    return ""
  }

  // Get headers from first object
  const headers = Object.keys(data[0].toObject())

  // Create CSV header row
  let csv = headers.join(",") + "\n"

  // Add data rows
  data.forEach((item) => {
    const row = headers
      .map((header) => {
        // Convert object to plain JS object
        const obj = item.toObject()
        let value = obj[header]

        // Format dates
        if (value instanceof Date) {
          value = value.toISOString().split("T")[0]
        }

        // Handle nested objects (like whatsappNotification)
        if (typeof value === "object" && value !== null) {
          value = JSON.stringify(value)
        }

        // Escape commas and quotes
        if (value !== null && value !== undefined) {
          value = String(value).replace(/"/g, '""')
          if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            value = `"${value}"`
          }
        } else {
          value = ""
        }

        return value
      })
      .join(",")

    csv += row + "\n"
  })

  return csv
}

module.exports = {
  convertToCSV,
}
