// Datenbankschema fur Bewertungen.
// serviceTyp gibt an ob es sich um ein Hotel, einen Flug, einen Mietwagen oder ein Paket handelt.
// serviceId verweist auf die ID des bewerteten Angebots in der jeweiligen Datenbank.
// Bei Paketen wird die ID des enthaltenen Fluges als serviceId verwendet.

const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  serviceTyp:  { type: String, required: true, enum: ['hotel', 'flug', 'mietwagen', 'paket'] },
  serviceId:   { type: String, required: true },
  bewertung:   { type: Number, required: true, min: 1, max: 5 },
  kommentar:   { type: String },
  autor:       { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
