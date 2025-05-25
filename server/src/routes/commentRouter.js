import express from 'express';
import {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';

const router = express.Router();

router.get('/:postId', getCommentsByPostId);
router.post('/:postId', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;