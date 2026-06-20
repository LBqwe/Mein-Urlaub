const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Registrieren
router.post('/register', async (req, res) => {
  try {
    const { username, password, role, email, telefon, adresse, wohnort } = req.body;
    if (!username || !password || !email || !wohnort) {
      return res.status(400).json({ message: 'Benutzername, Passwort, E-Mail und Wohnort sind Pflichtfelder.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, role, email, telefon, adresse, wohnort });
    await user.save();
    res.status(201).json({ message: 'User erstellt' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User nicht gefunden' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Falsches Passwort' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Token-Middleware
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

// Profil abrufen
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User nicht gefunden' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Profil aktualisieren
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { email, telefon, adresse, wohnort, currentPassword, newPassword } = req.body;
    const updates = { email, telefon, adresse, wohnort };

    if (newPassword) {
      const user = await User.findById(req.user.id);
      const valid = await bcrypt.compare(currentPassword || '', user.password);
      if (!valid) return res.status(401).json({ message: 'Aktuelles Passwort ist falsch.' });
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;