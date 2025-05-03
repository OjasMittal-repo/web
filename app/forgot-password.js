const express = require('express');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

const users = [
  { email: 'user@example.com', name: 'John Doe' },  // Example user data
];

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password',   // Replace with your email password (or use app password)
  },
});

// Simulate a database for password reset tokens (in-memory)
const resetTokens = {};

// Forgot password route
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  
  // Check if the email exists in our database
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ success: false, message: "Email not found." });
  }

  // Generate a unique token
  const token = uuid.v4();

  // Store the token with the email in-memory (in real apps, store this in a database)
  resetTokens[token] = { email, expires: Date.now() + 3600000 };  // 1 hour expiry
  
  // Create a password reset link
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  // Send the reset link to the user's email
  transporter.sendMail({
    from: 'your-email@gmail.com',  // Sender email
    to: email,                    // Receiver email
    subject: 'Password Reset Link',
    text: `Click the following link to reset your password: ${resetLink}`,
  }, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: "Failed to send reset email." });
    }
    res.json({ success: true, message: "Reset link sent successfully!" });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
