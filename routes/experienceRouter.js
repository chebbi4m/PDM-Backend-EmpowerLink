import express from 'express';
import { body } from 'express-validator';
import { createExperience, editExperience, deleteExperience, getExperienceById, getExperiences, getMyExperiences, getExperiencesByCommunity, getExperiencesSortedByDate, getExperiencesByCommunityIOS } from '../controllers/experience.js'

const router = express.Router();

router.post('/createExperience', [
    body('username').notEmpty(),
    // body('communityId').notEmpty(),
    body('title').notEmpty(),
    body('text').notEmpty(),
    body('image'),
], createExperience);

router.post('/editExperience', [
    body('experienceId').notEmpty(),
    body('title'),
    body('text'),
    body('image'),
], editExperience);

router.post('/deleteExperience', [
    body('experienceId').notEmpty(),
], deleteExperience);

router.get('/getExperienceById', [
    body('experienceId').notEmpty(),
], getExperienceById);

router.get('/getExperiences',getExperiences)

router.get('/getMyExperiences',getMyExperiences)

router.get('/getExperiencesByCommunity/:communityId', getExperiencesByCommunity);

router.get('/getExperiencesSortedByDate', getExperiencesSortedByDate);

router.get('/getExperiencesByCommunityIOS/', getExperiencesByCommunityIOS);

export default router;