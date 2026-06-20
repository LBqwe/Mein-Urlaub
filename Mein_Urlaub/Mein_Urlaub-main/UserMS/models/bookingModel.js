// Datenbankschema fur Buchungen
// Eine Buchung verknupft einen User mit einem Angebot (Hotel, Flug oder Mietwagen).
// Das details-Feld speichert die vollstandigen Daten des gebuchten Angebots
// als Objekt, damit die Buchung auch dann noch lesbar ist wenn das Original verandert wird.

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  serviceTyp: { type: String, enum: ['hotel', 'flug', 'mietwagen', 'paket'], required: true },
  serviceId:  { type: String, required: true },
  details:    { type: Object, required: true },
  von:        { type: Date },
  bis:        { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
