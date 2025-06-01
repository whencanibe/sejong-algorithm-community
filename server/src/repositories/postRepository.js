import prisma from '../models/prisma.js';

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

export async function updatePost(id, data) {
  return await prisma.post.update({
    where: { id: Number(id) },
    data,
  });
}

export async function deletePost(id) {
  return await prisma.post.delete({
    where: { id: Number(id) },
  });
}
