import express from 'express';
import { giveCard } from '../controllers/cardController.js';

const router = express.Router();

router.post('/reward', giveCard);

export default router;