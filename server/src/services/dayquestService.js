import prisma from '../models/prisma.js';
import { getTodayProblemDetail } from '../utils/getTodayProblemId.js';
import { getProblemDetail } from '../services/solvedacService.js'; 
import { saveQuestSolve } from '../repositories/questSolveRepository.js';
import { kstMidnight } from '../utils/utcTodayMidnight.js';
import { AppError } from '../errors/AppError.js';

//오늘의 퀘스트 진행 상태 조회 
//총 사용자 수, 오늘 문제를 푼 인원 수, 내가 오늘 풀었는지 여부를 반환
//내가 풀었다면 퀘스트 완료 기록 저장
export async function getDayquestStatus(userId) {
  const detail = getTodayProblemDetail();  // 오늘의 문제 ID, 제목 추출

  const totalUsers = await prisma.user.count(); // 전체 유저 수

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
  // 오늘 문제를 이미 풀었으면 퀘스트 완료 테이블에 저장
  if(hasSolvedToday){
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

/**
 * 오늘의 데일리 퀘스트(백준 문제)를 반환합니다.
 * - 내부적으로 날짜 기반 해시로 오늘의 문제 ID를 정하고, 제목과 함께 반환합니다.
 * - 문제 ID와 제목은 `getTodayProblemDetail`에서 계산됩니다.
 *
 * @returns {{ todayProblemId: number, todayProblemTitle: string }}
 * @throws {AppError} - 문제 정보를 가져올 수 없는 경우
 */
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