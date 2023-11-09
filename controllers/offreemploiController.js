const Offreemploi = require('../models/offreemploiModel');

// Get all "Offreemploi" items
exports.getOffreemplois = (req, res) => {
  Offreemploi.find()
    .then(offreemplois => {
      res.json(offreemplois);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

// Create a new "Offreemploi" item
exports.createOffreemploi = (req, res) => {
  const newOffreemploi = new Offreemploi(req.body);
  newOffreemploi.save()
    .then(offreemploi => {
      res.status(201).json(offreemploi);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

// Delete an "Offreemploi" item by ID
exports.deleteOffreemploi = (req, res) => {
  const offreemploiId = req.params.id;

  Offreemploi.findByIdAndRemove(offreemploiId)
    .then(deletedOffreemploi => {
      if (!deletedOffreemploi) {
        res.status(404).json({ message: 'Offreemploi not found' });
      } else {
        res.json({ message: 'Offreemploi deleted successfully' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

// Update an "Offreemploi" item by ID
exports.updateOffreemploi = (req, res) => {
  const offreemploiId = req.params.id;

  Offreemploi.findByIdAndUpdate(offreemploiId, req.body, { new: true })
    .then(updatedOffreemploi => {
      if (!updatedOffreemploi) {
        res.status(404).json({ message: 'Offreemploi not found' });
      } else {
        res.json(updatedOffreemploi);
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
