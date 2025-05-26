import express from 'express';
import { getDayquestStatusCtrl } from '../controllers/dayquestController.js';
import { isLoggedIn } from '../middlewares/middleware.js';
import { getTodayProblemId } from '../utils/getTodayProblemID.js';


const router = express.Router();

//router.get('/status', isLoggedIn, getDayquestStatusCtrl);

router.get('/today', (req, res) => {
  try {
    const id = getTodayProblemId();
    res.json({ id }); // ✅ 응답 잊지 말기
  } catch (err) {
    console.error("오늘의 문제 처리 실패:", err);
    res.status(500).json({ error: '오늘의 문제 처리 중 오류' });
  }
});


export default router;