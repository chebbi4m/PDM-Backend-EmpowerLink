const express = require('express');
const offreemploiRoutes = express.Router();
const offreemploiController = require('../controllers/offreemploiController');

offreemploiRoutes.get('/offreemplois', offreemploiController.getOffreemplois);
offreemploiRoutes.post('/offreemplois', offreemploiController.createOffreemploi);
offreemploiRoutes.delete('/offreemplois/:id', offreemploiController.deleteOffreemploi);
offreemploiRoutes.put('/offreemplois/:id', offreemploiController.updateOffreemploi);

module.exports = offreemploiRoutes;
