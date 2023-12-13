import express from 'express';
import { body } from 'express-validator';
import { createCommunity, editCommunity, deleteCommunity ,approveRequest, getCommunityById, getCommunityByName, getAllCommunities } from '../controllers/community.js'

const router = express.Router();

router.post('/createCommunity', [
    body('username').notEmpty(),
    body('name').notEmpty(),
    body('category').notEmpty(),
    body('objectif').notEmpty(),
    body('image'),
], createCommunity);

router.post('/editCommunity', [
    body('groupId').notEmpty(),
    body('name'),
], editCommunity);

router.post('/deleteCommunity', [
    body('groupId').notEmpty(),
], deleteCommunity);

router.get('/getCommunityById',getCommunityById);

router.post('/getCommunityByName',getCommunityByName);

router.get('/getAllCommunities',getAllCommunities)

router.post('/approveRequest',approveRequest)

export default router;