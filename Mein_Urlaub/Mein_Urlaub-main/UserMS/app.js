const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/authRouter');
const hotelProxy = require('./routes/hotelProxy');
const flightProxy = require('./routes/flightProxy');
const rentalProxy = require('./routes/rentalProxy');
const ratingProxy = require('./routes/ratingProxy');
const bookingRouter = require('./routes/bookingRouter');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('UserMS: MongoDB verbunden'))
  .catch((err) => console.error('UserMS Fehler:', err));

app.use('/auth', authRouter);
app.use('/hotels', hotelProxy);
app.use('/flights', flightProxy);
app.use('/rentals', rentalProxy);
app.use('/ratings', ratingProxy);
app.use('/bookings', bookingRouter);

app.listen(process.env.PORT, () => {
  console.log(`UserMS Gateway läuft auf Port ${process.env.PORT}`);
});

const path = require('path');

// Nach app.use(express.json()); hinzufügen:
app.use(express.static(path.join(__dirname, '../frontend')));