// Leitet Bewertungsanfragen an den RatingMS weiter.
// Nutzt die Umgebungsvariable RATING_SERVICE_URL als Zieladresse

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const RATING_URL = process.env.RATING_SERVICE_URL;

// GET - Alle Bewertungen
router.get('/', async (req, res) => {
  try {
    const response = await fetch(`${RATING_URL}/ratings`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Bewertungs-Service nicht erreichbar' });
  }
});

// GET - Bewertungen für einen bestimmten Service (z.B. /ratings/hotel/123)
router.get('/:serviceTyp/:serviceId', async (req, res) => {
  try {
    const response = await fetch(`${RATING_URL}/ratings/${req.params.serviceTyp}/${req.params.serviceId}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Bewertungs-Service nicht erreichbar' });
  }
});

// POST - Bewertung erstellen
router.post('/', async (req, res) => {
  try {
    const response = await fetch(`${RATING_URL}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Bewertungs-Service nicht erreichbar' });
  }
});

// DELETE - Bewertung löschen
router.delete('/:id', async (req, res) => {
  try {
    const response = await fetch(`${RATING_URL}/ratings/${req.params.id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Bewertungs-Service nicht erreichbar' });
  }
});

module.exports = router;

