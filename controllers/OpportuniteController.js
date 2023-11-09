const Opportunite = require('../models/OpportuniteModel');

exports.getOpportunite = (req, res) => {
  Opportunite.find()
    .then(opportunite => {
      res.json(opportunite);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.createOpportunite = (req, res) => {
  const newOpportunite = new Opportunite(req.body);
  newOpportunite.save()
    .then(opportunite => {
      res.status(201).json(opportunite);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

exports.deleteOpportunite = (req, res) => {
  const opportuniteId = req.params.id;

  Opportunite.findByIdAndRemove(opportuniteId)
    .then(deletedOpportunite => {
      if (!deletedOpportunite) {
        res.status(404).json({ message: 'Opportunite not found' });
      } else {
        res.json({ message: 'Opportunite deleted successfully' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.updateOpportunite = (req, res) => {
  const opportuniteId = req.params.id;

  Opportunite.findByIdAndUpdate(opportuniteId, req.body, { new: true })
    .then(updatedOpportunite => {
      if (!updatedOpportunite) {
        res.status(404).json({ message: 'Opportunite not found' });
      } else {
        res.json(updatedOpportunite);
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
