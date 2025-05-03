const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ojasmittal08@gmail.com',
    pass: 'khdr teux jiqi lxji'
  }
});

app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const resetLink = `http://localhost:3000/reset-password?token=dummy-token`;

  const mailOptions = {
    from: 'ojasmittal08@gmail.com',
    to: email,
    subject: 'Reset Your Password',
    text: `Click here to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send reset link. Please try again.' });
    }

    res.json({ success: true, message: 'Reset link sent successfully.' });
  });
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
