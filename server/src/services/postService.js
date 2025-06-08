import * as repo from '../repositories/postRepository.js';

/**
 * 전체 게시글 목록을 가져옵니다.
 * - 최신순 정렬 포함
 * - 작성자 이름 포함
 */
export async function listPosts() {
  return await repo.getAllPosts();
}

/**
 * 특정 게시글 하나를 ID로 조회합니다.
 * - 게시글 정보 + 작성자 이름 반환
 *
 * @param {number} id - 게시글 ID
 */
export async function readPost(id) {
  return await repo.getPostById(id);
}

/**
 * 새 게시글을 작성합니다.
 * - 제목/내용 누락 시 예외 발생
 * - 작성자 ID는 session 기반으로 전달됨
 *
 * @param {Object} data - 게시글 데이터 (title, content 등)
 * @param {number} userId - 작성자 ID
 */
export async function writePost(data, userId) {
  if (!data.title || !data.content) {
    throw new Error('제목, 내용, 모두 입력하세요');
  }
  return await repo.createPost({ ...data, userId });
}

/**
 * 기존 게시글을 수정합니다.
 * - 제목과 내용이 반드시 있어야 함
 *
 * @param {number} id - 수정 대상 게시글 ID
 * @param {Object} data - 수정할 내용 (title, content 등)
 */
export async function editPost(id, data) {
  if (!data.title || !data.content) {
    throw new Error('제목과 내용이 필요합니다');
  }
  return await repo.updatePost(id, data);
}

/**
 * 게시글을 삭제합니다.
 *
 * @param {number} id - 삭제할 게시글 ID
 */
export async function removePost(id) {
  return await repo.deletePost(id);
}