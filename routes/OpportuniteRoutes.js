import express from 'express';
const OpportuniteRoutes = express.Router();
import OpportuniteController from '../controllers/OpportuniteController.js';

OpportuniteRoutes.get('/opportunite', OpportuniteController.getOpportunite);
OpportuniteRoutes.post('/opportunite', OpportuniteController.createOpportunite);
OpportuniteRoutes.delete('/opportunite/:id', OpportuniteController.deleteOpportunite);
OpportuniteRoutes.put('/opportunite/:id', OpportuniteController.updateOpportunite);
OpportuniteRoutes.get('/opportunite/:id', OpportuniteController.getOpportuniteById);
OpportuniteRoutes.post('/apply', OpportuniteController.applyToOpportunity);
export default OpportuniteRoutes;
