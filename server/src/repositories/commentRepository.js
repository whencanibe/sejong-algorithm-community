import prisma from '../models/prisma.js';

export async function findByPostId(postId) {
  return await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      text: true,
      createdAt: true,
      updatedAt: true,
      userId: true, // 댓글 작성자id
      user: {
        select: {
          name: true, // 댓글 작성자 이름
        },
      },
    },
  });
}

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

export async function update(id, text) {
  return await prisma.comment.update({
    where: { id },
    data: { text },
  });
}

export async function remove(id) {
  return await prisma.comment.delete({
    where: { id },
  });
}

export async function findById(id) {
  return await prisma.comment.findUnique({
    where: { id },
  });
}