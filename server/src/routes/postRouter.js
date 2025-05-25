import express from 'express';
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js';
import { isLoggedIn } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPost);
router.post('/', isLoggedIn, createPost);
router.put('/:id', isLoggedIn, updatePost);
router.delete('/:id', isLoggedIn, deletePost);

export default router;