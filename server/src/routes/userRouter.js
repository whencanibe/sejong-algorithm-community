//사용자 인증 및 정보 라우터

import { Router } from 'express';
import { signup, login, logout, getMyInfo} from '../controllers/userApiController.js';
const router = Router();

router.post('/signup', signup); //회원가입
router.post('/login', login);   //로그인
router.get('/logout', logout);  //로그아웃
router.get('/me', getMyInfo);   //로그인된 사용자 정보 반환

export default router;

