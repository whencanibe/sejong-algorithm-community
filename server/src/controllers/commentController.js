import * as service from '../services/commentService.js';

export async function getCommentsByPostId(req, res) {
  const postId = Number(req.params.postId);
  const comments = await service.getComments(postId);
  res.json(comments);
}

export async function createComment(req, res) {
  const postId = Number(req.params.postId);
  const userId = req.session.user?.id; // 세션에서 로그인한 유저 ID

  if (!userId) return res.status(401).json({ error: '로그인 필요' });

  const { text } = req.body;
  const newComment = await service.addComment(postId, userId, text);
  res.status(201).json(newComment);
}

export async function updateComment(req, res) {
  const id = Number(req.params.id);
  const { text } = req.body;
  const updated = await service.editComment(id, text);
  res.json(updated);
}

export async function deleteComment(req, res) {
  const id = Number(req.params.id);
  await service.removeComment(id);
  res.status(204).send();
}