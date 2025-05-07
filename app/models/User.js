// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  resetToken: String,
  resetTokenExpire: Date
});

module.exports = mongoose.model('User', userSchema);
