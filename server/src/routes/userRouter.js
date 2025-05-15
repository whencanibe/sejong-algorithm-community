import { Router } from 'express';
import { signupCtrl } from '../controllers/userApiController.js';
const router = Router();

router.get('/', (req, res) => {
  res.send('User route');
});

router.post('/api/signup', signupCtrl);

export default router;
