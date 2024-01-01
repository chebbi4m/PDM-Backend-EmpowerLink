import express from 'express';
const router = express.Router();
import { pay } from "../controllers/payment.controller.js";

router.post('/pay', pay);

export default router;