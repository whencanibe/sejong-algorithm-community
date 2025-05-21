import prisma from '../models/prisma.js';

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

export async function findUserById(id) {
    return await prisma.user.findUnique({
        where: { id }
    })
}

export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  };