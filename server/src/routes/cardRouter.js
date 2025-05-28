import express from 'express';
import { rewardCard, getUserCardList } from '../controllers/cardController.js';
const router = express.Router();

router.post('/reward', rewardCard);       // 카드 지급
router.get('/me', getUserCardList);       // 내가 가진 카드 목록
export default router;