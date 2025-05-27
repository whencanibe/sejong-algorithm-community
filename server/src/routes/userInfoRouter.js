import { Router } from 'express';
import { getPercentilesForUserCtrl, getUserInfoCtrl } from '../controllers/userInfoController.js';
import { refreshSolvedInfoCtrl } from '../controllers/weeklyRankController.js';

const router = Router();

router.get('/api/mypage/:id',getUserInfoCtrl); //id => user id
router.post('/api/refresh/:id', refreshSolvedInfoCtrl); // id => user id
router.get('/api/percentile/:id',getPercentilesForUserCtrl); // id => user id

export default router;
