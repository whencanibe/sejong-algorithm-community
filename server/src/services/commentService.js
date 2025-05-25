import * as repo from '../repositories/commentRepository.js';

export function getComments(postId) {
  return repo.findByPostId(postId);
}

export function addComment(postId, userId, text) {
  return repo.create({ postId, userId, text });
}

export function editComment(id, text) {
  return repo.update(id, text);
}

export function removeComment(id) {
  return repo.remove(id);
}