// server.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Forgot password route
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Configure nodemailer with your Gmail and App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ojasmittal08@gmail.com',          // ✅ Replace with your Gmail
        pass: 'brmr txbm mjqf ypny'              // ✅ Replace with your Gmail App Password
      }
    });

    const mailOptions = {
      from: '"Newsletter Support" <ojasmittal08@gmail.com>',
      to: email,
      subject: 'Reset Your Password',
      text: 'Click here to reset your password: http://127.0.0.1:5500/app/public/reset-password.html'
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send reset link.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
