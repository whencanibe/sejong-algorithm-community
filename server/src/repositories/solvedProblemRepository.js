import prisma from "../models/prisma.js";

export async function saveSolvedProblem({userId, problemId}) {
    return await prisma.solvedproblem.create({
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
  return await prisma.solvedProblem.createMany({
    data: solvedList.map(id => ({
      userId,
      problemId: id,
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

/**
 * 
 * @param {Number} userId 
 * @returns {Promise<Array|null>} - 문제 푼 날짜 배열 반환
 */
export async function getSolvedDates(userId) {
  return await prisma.solvedProblem.findMany({
    where: { userId },
    select: { solvedAt: true },
  });
}

// 오늘의 문제 id를 해결한 유저 수 세기
export async function countUsersWhoSolved(problemId) {
  return await prisma.solvedProblem.count({
    where: { problemId }
  });
}

// 오늘의 문제를 풀었는지 확인
export async function hasUserSolvedProblem(userId, problemId) {
  const record = await prisma.solvedProblem.findUnique({
    where: {
      userId_problemId: { userId, problemId }
    }
  });
  return !!record;
}

export async function getSolvedDatesSince(userId, fromDate) {
  return await prisma.solvedProblem.findMany({
    where: {
      userId,
      solvedAt: { gte: fromDate }
    },
    select: { solvedAt: true }
  });
}