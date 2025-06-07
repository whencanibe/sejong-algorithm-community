import prisma from "../models/prisma.js";

/**
 * 사용자가 푼 문제를 데이터베이스에 저장합니다.
 * 이미 푼 기록이 있는지는 이 함수 외부에서 별도로 체크해야 합니다.
 *
 * @param {Object} params - 파라미터 객체
 * @param {number} params.userId - 사용자 ID
 * @param {number} params.problemId - 문제 ID
 * @returns {Promise<{userId: number, problemId: number}>} - 저장된 정보
 */
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

/**
 * 주어진 problemId에 해당하는 푼 문제(solvedproblem) 레코드를 조회합니다.
 * 유저 - 문제 중복 없이 저장하는 구조
 *
 * @param {number} problemId - 문제 ID
 * @returns {Promise<Object|null>} - 해당 문제 풀이 정보 또는 없을 경우 null
 */
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
  const record = await prisma.solvedProblem.findFirst({
    where: {
      userId_problemId: { userId, problemId }
    }
  });
  return !!record;
}

/**
 * 주어진 사용자 ID에 대해 특정 날짜 이후로 푼 문제들의 날짜 목록을 조회합니다.
 *
 * @param {number} userId - 사용자 고유 ID
 * @param {Date} fromDate - 기준 날짜 (이 날짜 이후부터 조회됨, 포함)
 * @returns {Promise<{ solvedAt: Date }[]>} - 푼 날짜들이 담긴 객체 배열
 */
export async function getSolvedDatesSince(userId, fromDate) {
  return await prisma.solvedProblem.findMany({
    where: {
      userId,
      solvedAt: { gte: fromDate }
    },
    select: { solvedAt: true }
  });
}