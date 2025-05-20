import { Router } from 'express';
import { getUserInfoCtrl } from '../controllers/userInfoController.js';
import { refreshSolvedInfoCtrl } from '../controllers/weeklyRankController.js';

const router = Router();

router.get('/api/mypage/:id',getUserInfoCtrl); //id => user id
router.post('/api/refresh/:id', refreshSolvedInfoCtrl); // id => user id

export default router;
