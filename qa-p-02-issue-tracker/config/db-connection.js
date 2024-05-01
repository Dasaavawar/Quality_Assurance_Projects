//For MongoDB connection
const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URI;

mongoose.set('strictQuery', false);
const db = mongoose.connection;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  }).catch((error) => {
    console.log('Error connecting to MongoDB', error)
  });

module.exports = db;