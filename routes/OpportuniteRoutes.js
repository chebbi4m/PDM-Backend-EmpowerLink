const express = require('express');
const OpportuniteRoutes = express.Router();
const OpportuniteController = require('../controllers/OpportuniteController');

OpportuniteRoutes.get('/opportunite', OpportuniteController.getOpportunite);
OpportuniteRoutes.post('/opportunite', OpportuniteController.createOpportunite);
OpportuniteRoutes.delete('/opportunite/:id', OpportuniteController.deleteOpportunite);
OpportuniteRoutes.put('/opportunite/:id', OpportuniteController.updateOpportunite);

module.exports = OpportuniteRoutes;
