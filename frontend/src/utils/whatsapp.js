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
    if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.error("Twilio credentials not found in environment variables")
      throw new Error("Twilio credentials not configured")
    }

    // Construct the Twilio API URL
    const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`

    // Make API request
    const response = await axios({
      method: "post",
      url: twilioApiUrl,
      data: new URLSearchParams({
        To: `whatsapp:${formattedNumber}`,
        From: `${process.env.TWILIO_PHONE_NUMBER}`,
        Body: message,
      }),
      auth: {
        username: process.env.TWILIO_SID,
        password: process.env.TWILIO_AUTH_TOKEN,
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
    console.log("TWILIO_SID:", process.env.TWILIO_SID ? "✓ Set" : "✗ Not set")
    console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "✓ Set" : "✗ Not set")
    console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER ? "✓ Set" : "✗ Not set")

    if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.error("Twilio credentials not properly configured")
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
