import prisma from '../models/prisma.js';
import { getTodayProblemDetail } from '../utils/getTodayProblemId.js';

// 오늘 날짜 기준으로 오늘의 문제를 푼 사용자 수를 집계
export async function countTodaySolvedUsers() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 자정 기준 초기화

  const problemId = getTodayProblemDetail(); //오늘의 문제 id 가져오기

  const count = await prisma.solvedProblem.count({  //오늘의 문제를 오늘 날짜 이후로 푼 사람 수 세기 
    where: {
      problemId: problemId,
      solvedAt: {
        gte: today, //자정 이후
      },
    },
  });

  return count; //오늘의 문제 푼 사람 수 반환 
}