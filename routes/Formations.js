import express from 'express';
import {
  createFormation,
  uploadImages,
  getAllformations, 
  getFormationById, 
  removeFormation,
  updateFormation,
  addParticipant,
  getFormationsByUserId,
} from '../controllers/FormationController.js';

import {getAll, add, update,remove} from '../controllers/FormationBackOfficeController.js';

import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const formationID = req.headers.formationid;
    const dir = `./uploads/formations/formation-${formationID.toString()}/images/`;
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/**
 * @Path /formation
 */
router.post('/create', createFormation);

router.route('/uploadImages/:id').post(uploadImages);

router.get('/all', getAllformations); // Corrected function name

router.get('/', getFormationById); // Corrected function name

router.post('/delete', removeFormation);
router.post('/addParticipant', addParticipant);

router.put('/update', upload.single('image'), updateFormation);
router.get('/formations', getFormationsByUserId);

router.get('/back-office', getAll);
router.post('/back-office', add);
router.put('/back-office', update);
router.delete('/back-office/:id', remove);

export default router;