const express = require('express');
const router = express.Router();
const RentalCar = require('../models/rentalModel');

// GET - Alle Mietwagen
router.get('/', async (req, res) => {
  try {
    const cars = await RentalCar.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Ein Mietwagen
router.get('/:id', async (req, res) => {
  try {
    const car = await RentalCar.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Mietwagen nicht gefunden' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Mietwagen erstellen (nur Admin)
router.post('/', async (req, res) => {
  try {
    const car = new RentalCar(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Mietwagen aktualisieren (nur Admin)
router.put('/:id', async (req, res) => {
  try {
    const car = await RentalCar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: 'Mietwagen nicht gefunden' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Mietwagen löschen (nur Admin)
router.delete('/:id', async (req, res) => {
  try {
    const car = await RentalCar.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Mietwagen nicht gefunden' });
    res.json({ message: 'Mietwagen gelöscht' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;