// Import necessary modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env

const app = express();

// Middleware
app.use(morgan('dev'));  // Logging requests
app.use(bodyParser.json());  // Parse JSON bodies
app.use(cors());  // Enable CORS for all domains (restrict in production)

// Serve static files from 'public' directory
app.use(express.static('public'));

// MongoDB connection setup
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Define User model
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
}));

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ status: "error", message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "error", message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Respond with success
    res.json({ status: "success", message: "User created successfully" });

  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "All fields are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ status: "error", message: "Invalid credentials" });
    }

    // Respond with success
    res.json({ status: "success", message: "Login successful" });

  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('./models/User');

// Middleware
app.use(express.json());

// POST route for /api/forgot-password
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'Email not found in our records.' });
    }

    // Create token
    const token = crypto.randomBytes(20).toString('hex');

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: '"Newsletter Support" <no-reply@newsletter.com>',
      to: email,
      subject: 'Reset Your Password',
      text: `Reset your password here: http://localhost:3000/reset-password.html?token=${token}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Forgot Password Route
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'Email not found in our records.' });
    }

    // Create token
    const token = crypto.randomBytes(20).toString('hex');

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: '"Newsletter Support" <no-reply@newsletter.com>',
      to: email,
      subject: 'Reset Your Password',
      text: `Reset your password here: http://localhost:3000/reset-password.html?token=${token}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
