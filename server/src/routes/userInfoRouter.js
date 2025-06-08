import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getFootprintsSessionCtrl, getStreakSessionCtrl } from '../controllers/dayquestController.js';
import { isLoggedIn } from '../middlewares/middleware.js';
import { upload } from '../middlewares/upload.js';
import * as userInfoController from '../controllers/userInfoController.js'; 

const router = Router();

//userId 세션에서 불러올 필요 없는 api
router.get('/api/globalranking', isLoggedIn,userInfoController.getGlobalRankingCtrl);                           //전체 랭킹
router.get('/api/studentranking/:department',isLoggedIn, userInfoController.getDepartmentRankingCtrl);          //학과별 랭킨

//세션 기반
router.get('/api/mypage', isLoggedIn, userInfoController.getUserInfoSessionCtrl);                               //마이페이지에 들어갈 유저 정보
router.post('/api/refresh', isLoggedIn, userInfoController.refreshSolvedInfoSessionCtrl);                       //백준 정보 갱신
router.get('/api/footprints', isLoggedIn, getFootprintsSessionCtrl);                                            //출석 도장 정보
router.get('/api/percentile', isLoggedIn, userInfoController.getPercentilesForUserSessionCtrl);                 //퍼센트 순위
router.get('/api/streak', isLoggedIn, getStreakSessionCtrl);                                                    //연속 출석 일수
router.post('/api/upload-profile', isLoggedIn, upload.single('image'), userInfoController.uploadProfileImage);  //프로필 이미지 업로드
router.get('/api/basicprofile', isLoggedIn, userInfoController.basicProfile);                                   //기본 정보(학과,이름,프로필사진)
router.patch('/api/change-nickname', isLoggedIn, userInfoController.changeNickname);                            //닉네임 수정

export default router;
