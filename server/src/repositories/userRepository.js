import prisma from "../models/prisma.js";

export async function createUser({ email, hashedPassword, name, baekjoonName }) {
    return prisma.user.create({
        data: { email, password: hashedPassword, name, baekjoonName }, // db에 저장할 값
        select: { id: true, email: true, name: true } // 응답에 반환될 값 선택
    })
}

export async function findUserById(id) {
    return await prisma.user.findUnique({
        where: { id }
    })
}

export async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email }
    })
}
