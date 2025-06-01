import { AppError } from '../errors/AppError.js';
import * as commentService from '../services/commentService.js';

export async function getCommentsByPostId(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    if (Number.isNaN(postId)) {
      return next(new AppError('잘못된 postId', 400));
    }
    const comments = await commentService.getComments(postId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
}

export async function createComment(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    if (Number.isNaN(postId)) {
      return next(new AppError('잘못된 postId', 400));
    }
    const userId = req.session.user?.id; // 세션에서 로그인한 유저 ID
    if (!userId) {
      throw new AppError('로그인이 필요합니다.', 401);
    }

    const { text } = req.body;
    if (!text) {
      throw new AppError('댓글 내용이 없습니다.', 400);
    }

    const newComment = await commentService.addComment(postId, userId, text);
    return res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }

}

export const updateComment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('잘못된 commentId', 400);
    }

    const { text } = req.body;
    if (!text) {
      throw new AppError('댓글 내용이 없습니다.', 400);
    }

    const updated = await commentService.editComment(id, text);
    if (!updated) {
      throw new AppError('댓글을 찾을 수 없습니다.', 404);
    }

    return res.json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('잘못된 commentId', 400);
    }

    const deleted = await commentService.removeComment(id);
    if (!deleted) {
      throw new AppError('댓글을 찾을 수 없습니다.', 404);
    }

    return res.status(204).send();   // No Content
  } catch (err) {
    return next(err);
  }
};