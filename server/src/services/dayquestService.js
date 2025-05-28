import prisma from '../models/prisma.js';
import { getTodayProblemId } from '../utils/getTodayProblemId.js';
import { getProblemDetail } from '../services/solvedacService.js'; 
import { saveDailyQuest } from '../repositories/dayquestRepository.js';
import { saveQuestSolve } from '../repositories/questSolveRepository.js';
import { utcMidnight } from '../utils/utcTodayMidnight.js';

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
    const date = utcMidnight();
    await saveQuestSolve({userId, date, problemId:todayProblemId})
  }

  return {
    todayProblemId,
    todayProblemTitle: title,
    hasSolvedToday: !!hasSolvedToday,
    totalUsers,
    solvedCount,
  };
}
