import prisma from '../models/prisma.js';
import { getTodayProblemId } from '../utils/getTodayProblemId.js';
import { getProblemDetail } from '../services/solvedacService.js'; 
import { saveQuestSolve } from '../repositories/questSolveRepository.js';
import { kstMidnight } from '../utils/utcTodayMidnight.js';
import { AppError } from '../errors/AppError.js';

export async function getDayquestStatus(userId) {
  const todayProblemId = getTodayProblemId();  
  
  const { title } = await getProblemDetail(todayProblemId);

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

  if(!!hasSolvedToday){
    const date = kstMidnight();
    await saveQuestSolve({userId, date, problemId:todayProblemId});
  }

  return {
    todayProblemId,
    todayProblemTitle: title,
    hasSolvedToday: !!hasSolvedToday,
    totalUsers,
    solvedCount,
  };
}

export async function getDailyQuest() {
  const todayProblemId = getTodayProblemId();  
  console.log('[daily] id 계산 완료:', todayProblemId);
  const detail = await getProblemDetail(todayProblemId);
  console.log('[daily] detail 도착:', detail); 
  if (!detail) {
    throw new AppError('문제 제목을 불러올 수 없음', 500);
  }

  return {
    todayProblemId,
    todayProblemTitle: detail.title
  };
}