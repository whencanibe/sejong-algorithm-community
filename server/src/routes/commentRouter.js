import express from 'express';
import {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { isLoggedIn } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/:postId', getCommentsByPostId);
router.post('/:postId', isLoggedIn, createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;