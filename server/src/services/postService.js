import * as repo from '../repositories/postRepository.js';

export function listPosts() {
  return repo.getAllPosts();
}

export function readPost(id) {
  return repo.getPostById(id);
}

export function writePost(data) {
  if (!data.title || !data.content || !data.author) {
    throw new Error('제목, 내용, 작성자 모두 입력하세요');
  }
  return repo.createPost(data);
}

export function editPost(id, data) {
  if (!data.title || !data.content) {
    throw new Error('제목과 내용이 필요합니다');
  }
  return repo.updatePost(id, data);
}

export function removePost(id) {
  return repo.deletePost(id);
}