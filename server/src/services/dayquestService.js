import prisma from '../models/prisma.js';
import { getTodayProblemDetail } from '../utils/getTodayProblemId.js';
import { getProblemDetail } from '../services/solvedacService.js'; 
import { saveQuestSolve } from '../repositories/questSolveRepository.js';
import { kstMidnight } from '../utils/utcTodayMidnight.js';
import { AppError } from '../errors/AppError.js';

export async function getDayquestStatus(userId) {
  const detail = getTodayProblemDetail();  

  const totalUsers = await prisma.user.count();

  const solvedCount = await prisma.solvedProblem.count({
    where: {
      problemId: detail.todayProblemId,
    },
  });

  const hasSolvedToday = await prisma.solvedProblem.findFirst({
    where: {
      userId,
      problemId: detail.todayProblemId,
    },
  });

  if(!!hasSolvedToday){
    const date = kstMidnight();
    await saveQuestSolve({userId, date, problemId:detail.todayProblemId});
  }

  return {
    todayProblemId: detail.todayProblemId,
    todayProblemTitle: detail.todayProblemTitle,
    hasSolvedToday: !!hasSolvedToday,
    totalUsers,
    solvedCount,
  };
}

export function getDailyQuest() {
  const detail = getTodayProblemDetail();  

  if (!detail) {
    throw new AppError('문제 제목을 불러올 수 없음', 500);
  }

  // { todayProblemId, todayProblemTitle}
  return {
    todayProblemId: detail.todayProblemId,
    todayProblemTitle: detail.todayProblemTitle
  };
}