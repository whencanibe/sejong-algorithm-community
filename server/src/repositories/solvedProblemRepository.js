import prisma from "../models/prisma.js";

export async function saveSolvedProblem({userId, problemId}) {
    return prisma.solvedproblem.create({
        data: {userId, problemId},
        select: {userId: true, problemId: true}
    });
}

// 여러개 insert + 중복 건 무시
/**
 * @param {number} userId
 * @param {Array}   solvedList  - 푼 문제 리스트 solvedList: [problemId]
 * @returns {Promise<Object|null>} 
 */
export async function saveSolvedProblemsBulk(userId, solvedList) {
  return prisma.solvedProblem.createMany({
    data: solvedList.map(p => ({
      userId,
      problemId: p.problemId,
      solvedAt : new Date(),
    })),
    skipDuplicates: true,             // @@unique 덕분에 안전
  });
}

export async function findSolvedProblemByProblemId(problemId) {
    return await prisma.solvedproblem.findUnique({
        where: { problemId }
    });
}

export async function getSolvedDates(userId) {
  return await prisma.solvedProblem.findMany({
    where: { userId },
    select: { solvedAt: true },
  });
}