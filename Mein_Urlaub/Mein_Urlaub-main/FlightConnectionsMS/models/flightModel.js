const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flugnummer:   { type: String, required: true },
  abflugort:    { type: String, required: true },
  zielort:      { type: String, required: true },
  abflugzeit:   { type: Date, required: true },
  ankunftzeit:  { type: Date, required: true },
  airline:      { type: String, required: true },
  preis:        { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Flight', flightSchema);