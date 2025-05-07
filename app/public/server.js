const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from public directory

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // In a real app, you would:
  // 1. Hash the password
  // 2. Store user in database
  // 3. Maybe send verification email
  
  console.log('New user:', { name, email });
  
  // For now, just return success
  res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});