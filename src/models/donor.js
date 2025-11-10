const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  contact: { type: String, required: true },
  notes: { type: String }
});

module.exports = mongoose.model('Donor', donorSchema);