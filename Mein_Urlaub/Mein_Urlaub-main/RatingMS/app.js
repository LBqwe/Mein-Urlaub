const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const ratingRouter = require('./routes/ratingRouter');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('RatingMS: MongoDB verbunden'))
  .catch((err) => console.error('RatingMS Fehler:', err));

app.use('/ratings', ratingRouter);

app.listen(process.env.PORT, () => {
  console.log(`RatingMS läuft auf Port ${process.env.PORT}`);
});