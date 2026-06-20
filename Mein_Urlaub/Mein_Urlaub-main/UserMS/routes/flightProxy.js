const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const FLIGHT_URL = process.env.FLIGHT_SERVICE_URL;

router.get('/', async (req, res) => {
  try {
    const response = await fetch(`${FLIGHT_URL}/flights`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Flug-Service nicht erreichbar' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await fetch(`${FLIGHT_URL}/flights/${req.params.id}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Flug-Service nicht erreichbar' });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await fetch(`${FLIGHT_URL}/flights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Flug-Service nicht erreichbar' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await fetch(`${FLIGHT_URL}/flights/${req.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Flug-Service nicht erreichbar' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await fetch(`${FLIGHT_URL}/flights/${req.params.id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Flug-Service nicht erreichbar' });
  }
});

module.exports = router;
