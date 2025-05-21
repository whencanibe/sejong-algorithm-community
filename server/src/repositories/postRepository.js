import prisma from '../models/prisma.js';

export async function getAllPosts() {
  return await prisma.post.findMany({ orderBy: { id: 'desc' } });
}

export async function getPostById(id) {
  return await prisma.post.findUnique({ where: { id: Number(id) } });
}

export async function createPost(data) {
  return await prisma.post.create({ data });
}

export async function updatePost(id, data) {
  return await prisma.post.update({ where: { id: Number(id) }, data });
}

export async function deletePost(id) {
  return await prisma.post.delete({ where: { id: Number(id) } });
}