import * as repo from '../repositories/postRepository.js';

export async function listPosts() {
  return await repo.getAllPosts();
}

export async function readPost(id) {
  return await repo.getPostById(id);
}

export async function writePost(data, userId) {
  if (!data.title || !data.content) {
    throw new Error('제목, 내용, 모두 입력하세요');
  }
  return await repo.createPost({ ...data, userId });
}

export async function editPost(id, data) {
  if (!data.title || !data.content) {
    throw new Error('제목과 내용이 필요합니다');
  }
  return await repo.updatePost(id, data);
}

export async function removePost(id) {
  return await repo.deletePost(id);
}