import prisma from '../models/prisma.js';
import { getTodayProblemId } from '../utils/getTodayProblemId.js';

export async function countTodaySolvedUsers() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 자정 기준

  const problemId = getTodayProblemId();

  const count = await prisma.solvedProblem.count({
    where: {
      problemId: problemId,
      solvedAt: {
        gte: today,
      },
    },
  });

  return count;
}

export async function saveDailyQuest({ date, problemId }) {
  return prisma.dailyQuest.upsert({
    where: {
      date_problemId: { date, problemId }
    },
    update: {},                 // 이미 있으면 그대로 둠
    create: { date, problemId } // 없으면 새로 INSERT
  });
}