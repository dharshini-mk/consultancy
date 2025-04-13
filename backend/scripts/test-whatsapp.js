const dotenv = require("dotenv")
dotenv.config()

const { testWhatsAppConfiguration, sendWhatsAppMessage } = require("../utils/whatsapp")

const testNumber = process.argv[2] // Get phone number from command line argument

async function runTest() {
  console.log("=== WhatsApp Configuration Test ===")

  const configValid = await testWhatsAppConfiguration()

  if (!configValid) {
    console.error("WhatsApp configuration is invalid. Please check your environment variables.")
    return
  }

  if (!testNumber) {
    console.error("Please provide a phone number to test. Example: npm run test-whatsapp +919876543210")
    return
  }

  console.log(`Attempting to send a test message to ${testNumber}...`)

  try {
    const result = await sendWhatsAppMessage(
      testNumber,
      "This is a test message from your Parlor Booking System. If you received this, WhatsApp notifications are working correctly!",
    )

    console.log("Test message sent successfully!")
    console.log("Message SID:", result.sid)
  } catch (error) {
    console.error("Failed to send test message:", error.message)
  }
}

runTest()
