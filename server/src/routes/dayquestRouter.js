import express from 'express';
import { getDayquestStatusCtrl } from '../controllers/dayquestController.js';
import { isLoggedIn } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/status', isLoggedIn, getDayquestStatusCtrl);

export default router;