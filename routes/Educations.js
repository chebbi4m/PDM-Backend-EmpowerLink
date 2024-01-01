import express from 'express';
import {createEducation, getAllEducations, getEducationById, removeEducation, updateEducation} from '../controllers/EducationController.js';
import {getAll, add, update,remove} from '../controllers/EducationBackOfficeController.js';

const router = express.Router();

/**
 * @Path /education
 */
router.post('/create', createEducation);

router.get('/all', getAllEducations);

router.get('/', getEducationById);

router.post('/delete', removeEducation);

router.put('/update', updateEducation);

router.get('/back-office', getAll);
router.post('/back-office', add);
router.put('/back-office', update);
router.delete('/back-office/:id', remove);

export default router;