import prisma from "../models/prisma.js";

export async function createSnapshot({ userId, solvedCount }) {
    return await prisma.solveSnapshot.create({
        data: {
            userId,
            solvedCount,
            snapedAt: new Date(),
        }
    });
}

export async function findSecondLastSnapshot(userId) {
    return await prisma.solveSnapshot.findFirst({
        where: { userId },
        orderBy: { snapedAt: 'desc' },
        skip: 1 // 방금 저장한 것 하나 건너뛰기
    });
}