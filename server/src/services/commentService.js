import * as repo from '../repositories/commentRepository.js';

//특정 게시글의 모든 댓글을 가져오는 서비스 함수 (컨트롤러 - 서비스 - 레포지토리 - DB)
export async function getComments(postId) {
  return await repo.findByPostId(postId);
}

//새로운 댓글을 작성하는 서비스 함수 (클라이언트가 입력한 텍스트와 유저 정보를 받아 저장 요청 위임)
export async function addComment(postId, userId, text) {
  return await repo.create({ postId, userId, text });
}

//기존 댓글을 수정하는 서비스 함수 (컨트롤러로부터 id와 수정 텍스트를 받아 DB 업데이트를 요청)
export async function editComment(id, text) {
  return await repo.update(id, text);
}

//댓글을 삭제하는 서비스 함수 (삭제할 댓글의 ID를 받아 삭제 작업을 수행)
export async function removeComment(id) {
  return await repo.remove(id);
}

//특정 댓글을 ID로 찾아오는 서비스 함수 (주로 댓글 수정 시 권한 확인 또는 존재 여부 검사용으로 사용)
export async function findCommentById(id) {
  return await repo.findById(id);
}