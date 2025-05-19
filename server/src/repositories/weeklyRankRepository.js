import prisma from '../models/prisma.js';

export async function getMyWeeklySolved(userId, weekStart) {
  return await prisma.weeklyRank.findUnique({
    where: { weekStart_userId: { weekStart, userId } },
    select: { solvedThisWeek: true },
  });
}

/**
 * 특정 스코프(ALL=전체 or 전공)에서 이번 주 랭킹 숫자 반환
 * @param {number} userId
 * @param {Date}   weekStart  - 이번 주 월요일 00:00
 * @param {string} department - 'ALL' = 학교 전체, 그 외 = 전공명
 * @returns {Promise<number|null>}  1부터 시작 랭킹, 없으면 null
 */
export async function getRank(userId, weekStart, department = 'ALL') {
  // 해당 사용자 주간 풀이 수 가져오기
  const me = await prisma.weeklyRank.findUnique({
    where: { weekStart_userId: { weekStart, userId } },
    select: { solvedThisWeek: true },
  });
  if (!me) return null;                 // 이번 주 데이터가 없을 때

  // 해당 사용자보다 많이 푼 사람 수 세기
  const higher = await prisma.weeklyRank.count({
    where: {
      weekStart,
      department,
      solvedThisWeek: { gt: me.solvedThisWeek },
    },
  });

  return higher + 1;                    // 1등이면 0+1 => 1
}

export async function getSchoolRanking(weekStart) {
  return await prisma.weeklyRank.findMany({
    where: { weekStart, department: 'ALL' },
    orderBy: { solvedThisWeek: 'desc' },
  });
}

export async function getDepartmentRanking(weekStart, department) {
  return await prisma.weeklyRank.findMany({
    where: { weekStart, department },
    orderBy: { solvedThisWeek: 'desc' },
  });
}