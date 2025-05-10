const axios = require("axios");

/**
 * Send a WhatsApp message using the Twilio API.
 * @param {string} to - Recipient phone number (with country code or plain digits).
 * @param {string} message - Message content.
 * @returns {Promise<Object>} - Twilio API response data.
 */
const sendWhatsAppMessage = async (to, message) => {
  try {
    // Check if both 'to' and 'message' are provided
    if (!to || !message) {
      throw new Error("Missing 'to' or 'message' parameter.");
    }

    console.log("🟢 Sending WhatsApp message...");
    console.log("📞 Raw input number:", to);
    console.log("💬 Message content:", message);

    // Sanitize the phone number by removing non-digit characters
    let sanitized = to.replace(/\D/g, ""); 

    // If the number is not starting with a '+', we assume it is a local number
    let formattedNumber = to.startsWith("+") ? to : `+${sanitized}`;

    // Ensure the number is properly formatted for Twilio's WhatsApp API
    formattedNumber = `whatsapp:${formattedNumber}`;

    console.log("✅ Formatted number:", formattedNumber);

    // Get Twilio credentials from environment variables
    const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
    
    // Ensure all Twilio credentials are present
    if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error("❌ Twilio credentials are missing in environment variables.");
    }

    // Construct the Twilio API URL
    const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;

    // Make the API request to send the WhatsApp message
    const response = await axios.post(
      twilioApiUrl,
      new URLSearchParams({
        To: formattedNumber,
        From: TWILIO_PHONE_NUMBER,
        Body: message,
      }),
      {
        auth: {
          username: TWILIO_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Log the response from Twilio and return it
    console.log("✅ Message sent. SID:", response.data.sid);
    return response.data;
  } catch (error) {
    // Capture and log any errors
    const errMsg = error.response?.data?.message || error.message || "Unknown error";
    console.error("❌ Failed to send WhatsApp message:", errMsg);
    throw new Error(errMsg);
  }
};

/**
 * Check if Twilio configuration is set properly.
 * @returns {boolean} - true if Twilio configuration is valid, false otherwise.
 */
const testWhatsAppConfiguration = () => {
  const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

  console.log("🔍 Testing Twilio configuration...");
  console.log("TWILIO_SID:", TWILIO_SID ? "✅ Set" : "❌ Not Set");
  console.log("TWILIO_AUTH_TOKEN:", TWILIO_AUTH_TOKEN ? "✅ Set" : "❌ Not Set");
  console.log("TWILIO_PHONE_NUMBER:", TWILIO_PHONE_NUMBER ? "✅ Set" : "❌ Not Set");

  // Return whether all the necessary configuration variables are present
  return !!(TWILIO_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER);
};

module.exports = {
  sendWhatsAppMessage,
  testWhatsAppConfiguration,
};