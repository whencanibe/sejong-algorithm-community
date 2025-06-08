import prisma from '../models/prisma.js';
// 모든 게시글을 최신순으로 가져오기 (작성자 이름 포함)
export async function getAllPosts() {
  return await prisma.post.findMany({
    orderBy: { id: 'desc' },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}
// 게시글 ID로 특정 게시글 가져오기 (작성자 이름 포함)
export async function getPostById(id) {
  return await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}
// 새 게시글 생성 (작성자 이름 포함 반환)
export async function createPost(data) {
  return await prisma.post.create({
    data,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}
// 게시글 수정
export async function updatePost(id, data) {
  return await prisma.post.update({
    where: { id: Number(id) },
    data,
  });
}
// 게시글 삭제
export async function deletePost(id) {
  return await prisma.post.delete({
    where: { id: Number(id) },
  });
}
