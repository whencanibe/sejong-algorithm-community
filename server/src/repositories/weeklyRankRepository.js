import prisma from '../models/prisma.js';
import { startOfWeek } from 'date-fns';

/**
 * 
 * @param {Array} data - [{weekStart, department, userId, solvedThisWeek}] 
 * @returns 
 */
export async function createWeeklyRanksBulk(data) {
  return await prisma.weeklyRank.creatMany({
    data: data,
    skipDuplicates: true,
  });
}

export async function getMyWeeklySolved(userId, weekStart, department = 'ALL') {
  return await prisma.weeklyRank.findUnique({
    where: { weekStart_userId_department: { weekStart, userId, department } },
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
    where: { weekStart_userId_department: { weekStart, userId, department } },
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

export async function upsertWeeklyRank({ user, delta }) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // 일요일
  await prisma.weeklyRank.upsert({
    where: {
      weekStart_userId_department: {
        weekStart, userId: user.id, department: user.department
      }
    },
    update: { solvedThisWeek: delta },
    create: {
      weekStart,
      department: user.department,
      userId: user.id,
      solvedThisWeek: delta
    }
  });

  // 학교 전체용 'ALL'
  await prisma.weeklyRank.upsert({
    where: {
      weekStart_userId_department: { weekStart, userId: user.id, department: 'ALL' }
    },
    update: { solvedThisWeek: delta },
    create: { weekStart, department: 'ALL', userId: user.id, solvedThisWeek: delta }
  });
}