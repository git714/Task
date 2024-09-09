const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure the email transporter using your email service provider (Gmail, SMTP, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com', 
  port: process.env.SMTP_PORT || 465, // SMTP port for Gmail (secure)
  secure: true, // Use SSL
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send an email notification
exports.sendEmailNotification = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.SMTP_USER, // Sender email
    to, // Receiver email
    subject, // Subject line
    text, // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
