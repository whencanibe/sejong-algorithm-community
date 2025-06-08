import express from 'express';
import {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js'; //컨트롤러로 요청 전달
import { isLoggedIn } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/:postId', getCommentsByPostId);          //특정 게시글 모든 댓글 조회
router.post('/:postId', isLoggedIn, createComment);   //댓글 작성
router.put('/:id', updateComment);                    //댓글 수정
router.delete('/:id', deleteComment);                 //댓글 삭제

export default router;