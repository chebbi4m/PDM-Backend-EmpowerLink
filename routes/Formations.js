import express from 'express';
import {
  createFormation,
  uploadImages,
  getAllformations, 
  getFormationById, 
  removeFormation,
  updateFormation,
} from '../controllers/FormationController.js';

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

router.put('/update', upload.single('image'), updateFormation);

export default router;
