const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  ort:         { type: String, required: true },
  land:        { type: String, required: true },
  sterne:      { type: Number, min: 1, max: 5 },
  preisProNacht: { type: Number, required: true },
  beschreibung: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);