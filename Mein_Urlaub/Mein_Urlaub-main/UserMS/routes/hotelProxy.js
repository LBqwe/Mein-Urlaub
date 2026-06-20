const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const HOTEL_URL = process.env.HOTEL_SERVICE_URL;

router.get('/', async (req, res) => {
  try {
    const response = await fetch(`${HOTEL_URL}/hotels`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Hotel-Service nicht erreichbar' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await fetch(`${HOTEL_URL}/hotels/${req.params.id}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Hotel-Service nicht erreichbar' });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await fetch(`${HOTEL_URL}/hotels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Hotel-Service nicht erreichbar' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await fetch(`${HOTEL_URL}/hotels/${req.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Hotel-Service nicht erreichbar' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await fetch(`${HOTEL_URL}/hotels/${req.params.id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({ message: 'Hotel-Service nicht erreichbar' });
  }
});

module.exports = router;
