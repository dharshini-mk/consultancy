const axios = require("axios")
const FormData = require("form-data")

/**
 * Send WhatsApp message using Twilio API
 * @param {String} to - Recipient phone number (with country code)
 * @param {String} message - Message content
 * @returns {Promise} - API response
 */
const sendWhatsAppMessage = async (to, message) => {
  try {
    console.log("Attempting to send WhatsApp message to:", to)

    // Format phone number (ensure it has country code)
    let formattedNumber = to
    if (!to.startsWith("+")) {
      // Add India country code if not present
      formattedNumber = `+91${to.replace(/\D/g, "")}`
    }

    console.log("Formatted number:", formattedNumber)
    console.log("Message:", message)

    // Check if Twilio credentials are available
    if (!process.env.WHATSAPP_API_URL || !process.env.WHATSAPP_API_TOKEN) {
      console.error("WhatsApp API credentials not found in environment variables")
      throw new Error("WhatsApp API credentials not configured")
    }

    // Create form data
    const formData = new FormData()
    formData.append("To", `whatsapp:${formattedNumber}`)
    formData.append("From", "whatsapp:+14155238886") // Twilio sandbox number
    formData.append("Body", message)

    console.log("Sending request to Twilio API:", process.env.WHATSAPP_API_URL)

    // Make API request
    const response = await axios({
      method: "post",
      url: process.env.WHATSAPP_API_URL,
      data: formData,
      headers: {
        ...formData.getHeaders(),
        Authorization: `Basic ${Buffer.from(`ACca4281932a6e0016c27789a91dd17836:${process.env.WHATSAPP_API_TOKEN}`).toString("base64")}`,
      },
    })

    console.log("WhatsApp message sent successfully:", response.data.sid)
    return response.data
  } catch (error) {
    console.error("WhatsApp API Error:", error.response ? error.response.data : error.message)
    throw error
  }
}

// Add a test function to verify WhatsApp configuration
const testWhatsAppConfiguration = async () => {
  try {
    console.log("Testing WhatsApp configuration...")
    console.log("API URL:", process.env.WHATSAPP_API_URL ? "✓ Set" : "✗ Not set")
    console.log("API Token:", process.env.WHATSAPP_API_TOKEN ? "✓ Set" : "✗ Not set")

    if (!process.env.WHATSAPP_API_URL || !process.env.WHATSAPP_API_TOKEN) {
      console.error("WhatsApp API credentials not properly configured")
      return false
    }

    return true
  } catch (error) {
    console.error("Error testing WhatsApp configuration:", error)
    return false
  }
}

module.exports = {
  sendWhatsAppMessage,
  testWhatsAppConfiguration,
}
