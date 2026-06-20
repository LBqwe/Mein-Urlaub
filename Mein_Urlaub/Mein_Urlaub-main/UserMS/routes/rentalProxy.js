const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const RENTAL_URL = process.env.RENTAL_SERVICE_URL;

router.get('/', async (req, res) => {
  try {
    const response = await fetch(`${RENTAL_URL}/rentals`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Mietwagen-Service nicht erreichbar' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await fetch(`${RENTAL_URL}/rentals/${req.params.id}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Mietwagen-Service nicht erreichbar' });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await fetch(`${RENTAL_URL}/rentals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Mietwagen-Service nicht erreichbar' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await fetch(`${RENTAL_URL}/rentals/${req.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Mietwagen-Service nicht erreichbar' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await fetch(`${RENTAL_URL}/rentals/${req.params.id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Mietwagen-Service nicht erreichbar' });
  }
});

module.exports = router;
