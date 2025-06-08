import express from 'express';
import { getDailyQuestCtrl, getDayquestStatusCtrl, refreshDailyQuestCtrl } from '../controllers/dayquestController.js';
import { isLoggedIn } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/status', isLoggedIn, getDayquestStatusCtrl);   //사용자 데일리 퀴스트 완료 여부 확인
router.post('/refresh', isLoggedIn, refreshDailyQuestCtrl); //사용자 데일리 퀘스트 새로고침
router.get('/problem', getDailyQuestCtrl);                  //데일리 퀘스트 문제 조회

export default router;