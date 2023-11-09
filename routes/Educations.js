import express from 'express';
import { createEducation, getAllEducations, getEducationById, removeEducation, updateEducation } from '../controllers/EducationController.js';

const router = express.Router();

/**
 * @Path /education
 */
router.post('/create', createEducation);

router.get('/all', getAllEducations);

router.get('/', getEducationById);

router.post('/delete', removeEducation);

router.put('/update', updateEducation);

export default router;
