require('dotenv').config();
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = (phoneNumber, message) => {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER, // use env variable
    to: phoneNumber,
  });
};

module.exports = sendSMS;
