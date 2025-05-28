import { Router } from 'express';
import { getPercentilesForUserCtrl, getUserInfoCtrl } from '../controllers/userInfoController.js';
import { getDepartmentWeeklyRankingCtrl, getStudentInDeptWeeklyRankingCtrl, refreshSolvedInfoCtrl } from '../controllers/weeklyRankController.js';
import { getFootprintsCtrl, getSteakCtrl } from '../controllers/dayquestController.js';

const router = Router();

router.get('/api/mypage/:id',getUserInfoCtrl); //id => user id
router.post('/api/refresh/:id', refreshSolvedInfoCtrl); // id => user id
router.get('/api/footprints/:id', getFootprintsCtrl);
router.get('/api/percentile/:id',getPercentilesForUserCtrl); // id => user id
router.get('/api/deptranking', getDepartmentWeeklyRankingCtrl);
router.get('/api/studentranking/:department', getStudentInDeptWeeklyRankingCtrl);
router.get('/api/streak/:id', getSteakCtrl);
export default router;
