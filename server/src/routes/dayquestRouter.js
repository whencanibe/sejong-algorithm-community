import express from 'express';
import { getDayquestStatusCtrl, refreshDailyQuestCtrl } from '../controllers/dayquestController.js';
import { isLoggedIn } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/status', isLoggedIn, getDayquestStatusCtrl);
router.post('/refresh', isLoggedIn, refreshDailyQuestCtrl);

export default router;