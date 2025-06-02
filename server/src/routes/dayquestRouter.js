import express from 'express';
import { getDailyQuestCtrl, getDayquestStatusCtrl, refreshDailyQuestCtrl } from '../controllers/dayquestController.js';
import { isLoggedIn } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/status', isLoggedIn, getDayquestStatusCtrl);
router.post('/refresh', isLoggedIn, refreshDailyQuestCtrl);
router.get('/problem', getDailyQuestCtrl);

export default router;