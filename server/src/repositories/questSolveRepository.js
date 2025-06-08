import prisma from '../models/prisma.js';

// 단일 퀘스트 해결 저장
export async function saveQuestSolve({ userId, date, problemId, solvedAt = new Date() }) {
  return await prisma.questSolve.upsert({
    where: {                                       // 복합 Primary Ket
      userId_date_problemId: { userId, date, problemId }
    },
    update: {},                                    // 이미 있으면 무시
    create: { userId, date, problemId, solvedAt }
  });
}

// 일정 구간 내 일일 퀘스트 해결 날짜 가져오기 (dateFrom <= 날짜 <= dateTo)
export async function fetchSolvedDates({userId, dateFrom, dateTo}) {
  const rows = await prisma.questSolve.findMany({
    where: {
      userId,
      date: { gte: dateFrom, lte: dateTo }
    },
    select: { date: true }
  });
  return rows.map(r => r.date);                    // [Date, Date, ...]
}
