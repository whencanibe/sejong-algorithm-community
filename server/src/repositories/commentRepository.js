import prisma from '../models/prisma.js';

//특정 게시글의 모든 댓글 조회
export async function findByPostId(postId) {
  return await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },  // 작성 시간 기준 오름차순 정렬
    select: {
      id: true,
      text: true,
      createdAt: true,
      updatedAt: true,
      userId: true, // 댓글 작성자 userid
      user: {
        select: {
          name: true, // 댓글 작성자 이름
        },
      },
    },
  });
}
//댓글 생성 (작성자 정보 포함 반환)
export async function create(data) {
  return await prisma.comment.create({
    data,
    include: {
      user: {
        select: { name: true },
      },
    },
  });
}

// 댓글 내용 수정
export async function update(id, text) {
  return await prisma.comment.update({
    where: { id },
    data: { text },
  });
}
// 댓글 삭제
export async function remove(id) {
  return await prisma.comment.delete({
    where: { id },
  });
}
// 댓글 ID로 단일 댓글 조회
export async function findById(id) {
  return await prisma.comment.findUnique({
    where: { id },
  });
}