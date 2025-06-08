import prisma from '../models/prisma.js';
import { getTodayProblemDetail } from '../utils/getTodayProblemId.js';

export async function countTodaySolvedUsers() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 자정 기준

  const problemId = getTodayProblemDetail();

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