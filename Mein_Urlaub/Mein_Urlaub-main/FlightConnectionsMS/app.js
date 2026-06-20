const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const flightRouter = require('./routes/flightRouter');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('FlightConnectionMS: MongoDB verbunden'))
  .catch((err) => console.error('FlightConnectionMS Fehler:', err));

app.use('/flights', flightRouter);

app.listen(process.env.PORT, () => {
  console.log(`FlightConnectionMS läuft auf Port ${process.env.PORT}`);
});