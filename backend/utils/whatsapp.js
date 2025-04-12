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
    // Format phone number (ensure it has country code)
    let formattedNumber = to
    if (!to.startsWith("+")) {
      // Add India country code if not present
      formattedNumber = `+91${to.replace(/\D/g, "")}`
    }

    // Create form data
    const formData = new FormData()
    formData.append("To", `whatsapp:${formattedNumber}`)
    formData.append("From", "whatsapp:+14155238886") // Twilio sandbox number
    formData.append("Body", message)

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

    return response.data
  } catch (error) {
    console.error("WhatsApp API Error:", error.response ? error.response.data : error.message)
    throw error
  }
}

module.exports = {
  sendWhatsAppMessage,
}
