import { Router } from 'express';
import { getFootprintsCtrl, getUserInfoCtrl } from '../controllers/userInfoController.js';
import { refreshSolvedInfoCtrl } from '../controllers/weeklyRankController.js';

const router = Router();

router.get('/api/mypage/:id',getUserInfoCtrl); //id => user id
router.post('/api/refresh/:id', refreshSolvedInfoCtrl); // id => user id
router.get('/api/footprints/:id', getFootprintsCtrl);

export default router;
