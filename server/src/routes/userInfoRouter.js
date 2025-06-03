import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getPercentilesForUserCtrl, getPercentilesForUserSessionCtrl, getUserInfoCtrl, getUserInfoSessionCtrl } from '../controllers/userInfoController.js';
import { getDepartmentWeeklyRankingCtrl, getStudentInDeptWeeklyRankingCtrl, refreshSolvedInfoCtrl, refreshSolvedInfoSessionCtrl } from '../controllers/weeklyRankController.js';
import { getFootprintsCtrl, getFootprintsSessionCtrl, getStreakCtrl, getStreakSessionCtrl } from '../controllers/dayquestController.js';
import { isLoggedIn } from '../middlewares/middleware.js';
import { upload } from '../middlewares/upload.js';
import * as userController from '../controllers/userInfoController.js'; 
import { basicProfile } from '../controllers/userInfoController.js';
const router = Router();
import { changeNickname } from '../controllers/userInfoController.js';

//테스트용
router.get('/api/mypage/:id', getUserInfoCtrl); //id => user id
router.post('/api/refresh/:id', refreshSolvedInfoCtrl); // id => user id
router.get('/api/footprints/:id', getFootprintsCtrl);
router.get('/api/percentile/:id', getPercentilesForUserCtrl); // id => user id
router.get('/api/streak/:id', getStreakCtrl);

//userId 세션에서 불러올 필요 없는 api
router.get('/api/globalranking', isLoggedIn,userController.getGlobalRankingCtrl);
router.get('/api/studentranking/:department',isLoggedIn, userController.getDepartmentRankingCtrl);

//세션 기반
router.get('/api/mypage', isLoggedIn, getUserInfoSessionCtrl);
router.post('/api/refresh', isLoggedIn, refreshSolvedInfoSessionCtrl);
router.get('/api/footprints', isLoggedIn, getFootprintsSessionCtrl);
router.get('/api/percentile', isLoggedIn, getPercentilesForUserSessionCtrl);
router.get('/api/streak', isLoggedIn, getStreakSessionCtrl);
router.post('/api/upload-profile', isLoggedIn, upload.single('image'), userController.uploadProfileImage);
router.get('/api/basicprofile', isLoggedIn, basicProfile);
router.patch('/api/change-nickname', isLoggedIn, changeNickname);

export default router;
