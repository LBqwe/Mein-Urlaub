const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['admin', 'user'], default: 'user' },
  email:     { type: String, required: true },
  wohnort:   { type: String, required: true },
  telefon:   { type: String },
  adresse:   { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
