import { startOfWeek, differenceInCalendarDays, addDays, subDays } from 'date-fns';
import { fetchSolvedDates } from '../repositories/questSolveRepository.js';
import { utcMidnight } from '../utils/utcTodayMidnight.js';


/** YYYY-MM-DD (UTC) */
const toUtcKey = d =>
  (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);


export async function buildFootprints(userId) {
  const todayUtc = utcMidnight();                             
  const weekStart = startOfWeek(todayUtc, { weekStartsOn: 0 }); 

  const solvedDates = await fetchSolvedDates({
    userId,
    dateFrom: weekStart,   // 그대로 UTC
    dateTo: todayUtc
  });

  const solvedSet = new Set(solvedDates.map(toUtcKey));
  const len = differenceInCalendarDays(todayUtc, weekStart) + 1;

  return Array.from({ length: len }, (_, i) =>
    solvedSet.has(toUtcKey(addDays(weekStart, i))) ? 1 : 0
  );
}


export async function getStreak(userId) {
  const todayUtc = utcMidnight();
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
