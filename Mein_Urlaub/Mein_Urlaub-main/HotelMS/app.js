const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const hotelRouter = require('./routes/hotelRouter');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('HotelMS: MongoDB verbunden'))
  .catch((err) => console.error('HotelMS Fehler:', err));

app.use('/hotels', hotelRouter);

app.listen(process.env.PORT, () => {
  console.log(`HotelMS läuft auf Port ${process.env.PORT}`);
});