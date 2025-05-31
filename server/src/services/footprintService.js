import { startOfWeek, differenceInCalendarDays, addDays, subDays } from 'date-fns';
import { fetchSolvedDates } from '../repositories/questSolveRepository.js';
import { kstMidnight } from '../utils/utcTodayMidnight.js';


// YYYY-MM-DD 예) 2025-05-31 형식으로 문자열 반환 하는 함수
const toUtcKey = d =>
  (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10); //타입이 날짜이면 그대로 쓰고 아니면 날짜로 변환 후, 문자열로 변환


export async function buildFootprints(userId) {
  const todayUtc = kstMidnight();                             
  const weekStart = startOfWeek(todayUtc, { weekStartsOn: 0 }); 

  const solvedDates = await fetchSolvedDates({
    userId,
    dateFrom: weekStart,   //UTC
    dateTo: addDays(todayUtc, 1) // 오늘 UTC 23:59:59초 까지
  });

  const solvedSet = new Set(solvedDates.map(toUtcKey));
  const len = differenceInCalendarDays(todayUtc, weekStart) + 1;

  
  const result = Array.from({ length: len }, (_, i) =>
    solvedSet.has(toUtcKey(addDays(weekStart, i))) ? 1 : 0
  );

  console.log(solvedSet, todayUtc);
  console.log(weekStart, result);
  return result;
}


export async function getStreak(userId) {
  const todayUtc = kstMidnight();
  const pastUtc = subDays(todayUtc, 100);       // 최근 100일만 조회

  const solvedSet = new Set(
    (await fetchSolvedDates({ userId, dateFrom: pastUtc, dateTo: todayUtc }))
      .map(toUtcKey)
  );

  let streak = 0;
  let started = false;

  for (let d = new Date(todayUtc); ; d.setUTCDate(d.getUTCDate() - 1)) {
    const key = toUtcKey(d);

    if (solvedSet.has(key)) {
      streak++;
      started = true;
    } else {
      if (started) break;          // 끊기면 종료
    }
    if (d <= pastUtc) break;       // 안전 장치
  }
  return streak;
}
