const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock forgot password endpoint
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: 'Email is required.' });
  }

  console.log(`Simulated: Sent reset link to ${email}`);
  res.json({ success: true, message: 'Reset link sent to your email.' });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'forgot-password.html'));
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
