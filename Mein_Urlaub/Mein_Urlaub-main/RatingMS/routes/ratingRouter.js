const express = require('express');
const router = express.Router();
const Rating = require('../models/ratingModel');

// GET - Alle Bewertungen
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Bewertungen für einen bestimmten Service
router.get('/:serviceTyp/:serviceId', async (req, res) => {
  try {
    const ratings = await Rating.find({
      serviceTyp: req.params.serviceTyp,
      serviceId: req.params.serviceId
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Bewertung erstellen (User + Admin)
router.post('/', async (req, res) => {
  try {
    const rating = new Rating(req.body);
    await rating.save();
    res.status(201).json(rating);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Bewertung löschen (nur Admin)
router.delete('/:id', async (req, res) => {
  try {
    const rating = await Rating.findByIdAndDelete(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Bewertung nicht gefunden' });
    res.json({ message: 'Bewertung gelöscht' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;