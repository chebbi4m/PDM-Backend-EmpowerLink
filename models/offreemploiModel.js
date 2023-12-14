const mongoose = require('mongoose');

const offreemploiSchema = new mongoose.Schema({
  title: String,
  description: String,
  lieu: String,
  Typedecontrat: String,
});

const Offreemploi = mongoose.model('Offreemploi', offreemploiSchema);

module.exports = Offreemploi;
