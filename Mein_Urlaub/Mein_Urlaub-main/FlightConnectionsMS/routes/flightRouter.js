// CRUD-Routen fur Flugverbindungen
// GET-Routen sind offentlich zuganglich.
// POST, PUT und DELETE sind im produktiven Einsatz dem Admin vorbehalten
// (Absicherung erfolgt uber den UserMS-Proxy).

const express = require('express');
const router = express.Router();
const Flight = require('../models/flightModel');

// GET - Alle Flüge
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Ein Flug
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flug nicht gefunden' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Flug erstellen (nur Admin)
router.post('/', async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Flug aktualisieren (nur Admin)
router.put('/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) return res.status(404).json({ message: 'Flug nicht gefunden' });
    res.json(flight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Flug löschen (nur Admin)
router.delete('/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flug nicht gefunden' });
    res.json({ message: 'Flug gelöscht' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;