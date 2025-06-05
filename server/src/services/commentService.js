import * as repo from '../repositories/commentRepository.js';

export async function getComments(postId) {
  return await repo.findByPostId(postId);
}

export async function addComment(postId, userId, text) {
  return await repo.create({ postId, userId, text });
}

export async function editComment(id, text) {
  return await repo.update(id, text);
}

export async function removeComment(id) {
  return await repo.remove(id);
}

export async function findCommentById(id) {
  return await repo.findById(id);
}