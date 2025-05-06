const express = require('express');
const path = require('path'); // Keep this import
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: 'Email is required.' });
  }

  // Set up transporter (use your Gmail and an app password)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ojasmittal08@gmail.com',       // ✅ your email
      pass: 'khdr teux jiqi lxji'          // ✅ Gmail App Password (not your regular password)
    }
  });

  const mailOptions = {
    from: 'ojasmittal08@gmail.com',
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Click <a href="http://localhost:3000/reset-password.html">here</a> to reset your password.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset link sent to ${email}`);
    res.json({ success: true, message: 'Reset link sent to your email.' });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Failed to send email.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'forgot-password.html'));
});

app.post('/api/reset-password', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.json({ success: false, message: 'Password is required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = { password: hashedPassword };
    const filePath = path.join(__dirname, 'passwords.json');

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error('Error writing password file:', err);
        return res.json({ success: false, message: 'Failed to save password.' });
      }
      res.json({ success: true, message: 'Password reset successful!' });
    });
  } catch (err) {
    console.error('Error hashing password:', err);
    res.json({ success: false, message: 'Error processing password.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
