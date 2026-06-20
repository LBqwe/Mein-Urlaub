const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const rentalRouter = require('./routes/rentalRouter');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('RentalCarMS: MongoDB verbunden'))
  .catch((err) => console.error('RentalCarMS Fehler:', err));

app.use('/rentals', rentalRouter);

app.listen(process.env.PORT, () => {
  console.log(`RentalCarMS läuft auf Port ${process.env.PORT}`);
});