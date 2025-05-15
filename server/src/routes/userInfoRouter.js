import { Router } from 'express';
import { getUserInfoCtrl } from '../controllers/userInfoController.js';
const router = Router();

router.get('/api/:id',getUserInfoCtrl);

export default router;
