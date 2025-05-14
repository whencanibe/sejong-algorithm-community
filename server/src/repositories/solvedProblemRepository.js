import prisma from "../models/prisma.js";

export async function saveSolvedProblem({userId, problemId}) {
    return prisma.solvedproblem.create({
        data: {userId, problemId},
        select: {userId: true, problemId: true}
    });
}

export async function findSolvedProblemByProblemId(problemId) {
    return await prisma.solvedproblem.findUnique({
        where: { problemId }
    });
}