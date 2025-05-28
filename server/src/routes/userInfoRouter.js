import { Router } from 'express';
import { getPercentilesForUserCtrl, getPercentilesForUserSessionCtrl, getUserInfoCtrl, getUserInfoSessionCtrl } from '../controllers/userInfoController.js';
import { getDepartmentWeeklyRankingCtrl, getStudentInDeptWeeklyRankingCtrl, refreshSolvedInfoCtrl, refreshSolvedInfoSessionCtrl } from '../controllers/weeklyRankController.js';
import { getFootprintsCtrl, getFootprintsSessionCtrl, getStreakCtrl, getStreakSessionCtrl } from '../controllers/dayquestController.js';

const router = Router();

//테스트용
router.get('/api/mypage/:id',getUserInfoCtrl); //id => user id
router.post('/api/refresh/:id', refreshSolvedInfoCtrl); // id => user id
router.get('/api/footprints/:id', getFootprintsCtrl);
router.get('/api/percentile/:id',getPercentilesForUserCtrl); // id => user id
router.get('/api/streak/:id', getStreakCtrl);

//userId 세션에서 불러올 필요 없는 api
router.get('/api/deptranking', getDepartmentWeeklyRankingCtrl);
router.get('/api/studentranking/:department', getStudentInDeptWeeklyRankingCtrl);

//세션 기반
router.get('/api/mypage',getUserInfoSessionCtrl); //id => user id
router.post('/api/refresh', refreshSolvedInfoSessionCtrl); // id => user id
router.get('/api/footprints', getFootprintsSessionCtrl);
router.get('/api/percentile',getPercentilesForUserSessionCtrl); // id => user id
router.get('/api/streak', getStreakSessionCtrl);
export default router;
