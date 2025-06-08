import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getFootprintsSessionCtrl, getStreakSessionCtrl } from '../controllers/dayquestController.js';
import { isLoggedIn } from '../middlewares/middleware.js';
import { upload } from '../middlewares/upload.js';
import * as userInfoController from '../controllers/userInfoController.js'; 

const router = Router();

//userId 세션에서 불러올 필요 없는 api
router.get('/api/globalranking', isLoggedIn,userInfoController.getGlobalRankingCtrl);
router.get('/api/studentranking/:department',isLoggedIn, userInfoController.getDepartmentRankingCtrl);

//세션 기반
router.get('/api/mypage', isLoggedIn, userInfoController.getUserInfoSessionCtrl);
router.post('/api/refresh', isLoggedIn, userInfoController.refreshSolvedInfoSessionCtrl);
router.get('/api/footprints', isLoggedIn, getFootprintsSessionCtrl);
router.get('/api/percentile', isLoggedIn, userInfoController.getPercentilesForUserSessionCtrl);
router.get('/api/streak', isLoggedIn, getStreakSessionCtrl);
router.post('/api/upload-profile', isLoggedIn, upload.single('image'), userInfoController.uploadProfileImage);
router.get('/api/basicprofile', isLoggedIn, userInfoController.basicProfile);
router.patch('/api/change-nickname', isLoggedIn, userInfoController.changeNickname);

export default router;
