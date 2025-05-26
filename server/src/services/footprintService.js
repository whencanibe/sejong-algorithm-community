import { startOfWeek, differenceInCalendarDays, addDays } from 'date-fns';
import { getSolvedDatesSince } from '../repository/solvedProblemRepository.js';

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
