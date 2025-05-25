import prisma from '../models/prisma.js';
import { getTodayProblemId } from '../utils/getTodayProblemId.js';

export async function getDayquestStatus(userId) {
  const todayProblemId = getTodayProblemId();

  const totalUsers = await prisma.user.count();

  const solvedCount = await prisma.solvedProblem.count({
    where: {
      problemId: todayProblemId,
    },
  });

  const hasSolvedToday = await prisma.solvedProblem.findFirst({
    where: {
      userId,
      problemId: todayProblemId,
    },
  });

  return {
    todayProblemId,
    hasSolvedToday: !!hasSolvedToday,
    totalUsers,
    solvedCount,
  };
}