import prisma from '../prismaClient.js';

export function getAllPosts() {
  return prisma.post.findMany({ orderBy: { id: 'desc' } });
}

export function getPostById(id) {
  return prisma.post.findUnique({ where: { id: Number(id) } });
}

export function createPost(data) {
  return prisma.post.create({ data });
}

export function updatePost(id, data) {
  return prisma.post.update({ where: { id: Number(id) }, data });
}

export function deletePost(id) {
  return prisma.post.delete({ where: { id: Number(id) } });
}