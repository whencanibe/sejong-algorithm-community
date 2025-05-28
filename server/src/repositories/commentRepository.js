import prisma from '../models/prisma.js';

export async function findByPostId(postId) {
  return await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: {
          name: true, // ✨ 유저 이름만 포함
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