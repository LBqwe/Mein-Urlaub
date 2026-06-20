// Schema fur Mietwagen. verfuegbar gibt an ob das Fahrzeug buchbar ist.

const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  marke:        { type: String, required: true },
  modell:       { type: String, required: true },
  ort:          { type: String, required: true },
  preisProTag:  { type: Number, required: true },
  verfuegbar:   { type: Boolean, default: true },
  kategorie:    { type: String, enum: ['Klein', 'Mittel', 'Gross', 'SUV', 'Luxus'] }
}, { timestamps: true });

module.exports = mongoose.model('RentalCar', rentalSchema);