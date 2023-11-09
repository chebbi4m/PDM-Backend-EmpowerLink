import express from 'express';
import { body } from 'express-validator';
import { createExperience, editExperience, deleteExperience, getExperienceById, getExperiences, getMyExperiences, getExperiencesByCommunity } from '../controllers/experience.js'

const router = express.Router();

router.post('/createExperience', [
    body('username').notEmpty(),
    body('communityId').notEmpty(),
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

router.get('/getExperiencesByCommunity',[
    body('communityId').notEmpty()
],getExperiencesByCommunity)


export default router;