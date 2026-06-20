const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/bookingModel');

function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Kein Token' });
  try {
    req.user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Ungültiger Token' });
  }
}

// GET /bookings/availability/:serviceTyp/:serviceId — gebuchte Zeiträume (öffentlich)
router.get('/availability/:serviceTyp/:serviceId', async (req, res) => {
  try {
    const { serviceTyp, serviceId } = req.params;
    const bookings = await Booking.find({
      serviceTyp, serviceId,
      von: { $exists: true, $ne: null }
    }).select('von bis -_id');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /bookings/me — alle Buchungen des eingeloggten Users
router.get('/me', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /bookings — neue Buchung anlegen
router.post('/', verifyToken, async (req, res) => {
  try {
    const { serviceTyp, serviceId, details, von, bis } = req.body;
    if (!serviceTyp || !serviceId || !details || !von || !bis) {
      return res.status(400).json({ message: 'serviceTyp, serviceId, details, von und bis sind Pflichtfelder.' });
    }
    const vonDate = new Date(von);
    const bisDate = new Date(bis);

    // Überschneidung mit bestehenden Buchungen prüfen
    const conflict = await Booking.findOne({
      serviceId,
      von: { $lte: bisDate },
      bis: { $gte: vonDate }
    });
    if (conflict) {
      return res.status(409).json({ message: 'Dieser Zeitraum ist bereits gebucht.' });
    }

    const booking = new Booking({ userId: req.user.id, serviceTyp, serviceId, details, von: vonDate, bis: bisDate });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /bookings/:id — Buchung stornieren
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Buchung nicht gefunden.' });

    const endDate = booking.bis || booking.von || booking.details?.ankunftzeit || booking.details?.abflugzeit;
    if (endDate && new Date(endDate) < new Date()) {
      return res.status(400).json({ message: 'Vergangene Buchungen können nicht storniert werden.' });
    }

    await Booking.findByIdAndDelete(booking._id);
    res.json({ message: 'Buchung storniert.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
