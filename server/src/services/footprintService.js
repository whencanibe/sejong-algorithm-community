import { startOfWeek, differenceInCalendarDays, addDays } from 'date-fns';
import { getSolvedDatesSince } from '../repositories/solvedProblemRepository.js';

// UTC -> 한국 시간 YYYY-MM-DD 문자열로 변환
function kstKey(dateUtc) {
  const kst = new Date(dateUtc.getTime() + 9 * 60 * 60 * 1000); // +9h
  return kst.toISOString().slice(0, 10);                         // ex) 2025-06-01
}

// 한국시간 00:00 Date 객체 
function kstTodayMidnight() {
  const now = new Date();
  // 한국 자정 = UTC 15:00
  now.setUTCHours(15, 0, 0, 0);
  return now;
}


export async function buildFootprints(userId) {
  const todayKst = kstTodayMidnight();                        // 한국 기준 오늘 00:00
  const weekStart = startOfWeek(todayKst, { weekStartsOn: 0 }); // 이번 주 일 00:00(KST)

  // weekStart(한국 시각). UTC로 변환하려면 -9시간 해야함.
  const weekStartUtc = new Date(weekStart.getTime() - 9 * 60 * 60 * 1000);

  const rows = await getSolvedDatesSince(userId, weekStartUtc);
  const solvedSet = new Set(rows.map(r => kstKey(r.solvedAt)));

  const len = differenceInCalendarDays(todayKst, weekStart) + 1;
  return Array.from({ length: len }, (_, i) =>
    solvedSet.has(kstKey(addDays(weekStart, i))) ? 1 : 0
  );
}
