import { Router } from 'express';
import { getSolvedProblemIdsCtrl } from '../controllers/solvedacApiController.js';
const router = Router();

router.get('/', (req, res) => {
  res.send('Solvedac route');
});

router.get('/api/solved/:handle', getSolvedProblemIdsCtrl); // handle에 백준 닉네임

export default router;
