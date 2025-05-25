import prisma from '../models/prisma.js';

export function findByPostId(postId) {
  return prisma.comment.findMany({
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

export function create(data) {
  return prisma.comment.create({
    data,
    include: {
      user: {
        select: { name: true },
      },
    },
  });
}

export function update(id, text) {
  return prisma.comment.update({
    where: { id },
    data: { text },
  });
}

export function remove(id) {
  return prisma.comment.delete({
    where: { id },
  });
}