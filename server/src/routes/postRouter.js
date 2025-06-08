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

router.get('/', getAllPosts);                     //전체 게시글 목록
router.get('/:id', getPost);                      //특정 게시글 불러오기
router.post('/', isLoggedIn, createPost);         //게시글 작성
router.put('/:id', isLoggedIn, updatePost);       //게시글 수정
router.delete('/:id', isLoggedIn, deletePost);    //게시글 삭제

export default router;