import express from 'express';
import { signup, login, logout, getMyInfo} from '../controllers/userApiController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', getMyInfo);

export default router;
