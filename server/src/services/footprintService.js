import { startOfWeek, differenceInCalendarDays, addDays, subDays } from 'date-fns';
import { getSolvedDatesSince } from '../repositories/solvedProblemRepository.js';
import { fetchSolvedDates } from '../repositories/questSolveRepository.js';

const KST_OFFSET = 9 * 60 * 60 * 1000;
const toKstKey = d => new Date(d.getTime() + KST_OFFSET).toISOString().slice(0, 10);

const DAY_MS = 24 * 60 * 60 * 1000;

/** 오늘(KST) 00:00 Date 객체 */
function kstTodayMidnight() {
  const d = new Date();
  d.setUTCHours(15, 0, 0, 0);            // UTC 15 = KST 00
  return d;
}

/** KST 기준 이번 주 일요일 00:00 */
function kstWeekStart(todayKst) {
  // 1) UTC-9 h 로 이동해 ‘UTC 주간’ 계산
  const shifted = new Date(todayKst.getTime() - KST_OFFSET);
  // 2) 다시 +9 h 되돌림
  const sunday = startOfWeek(shifted, { weekStartsOn: 0 });
  return new Date(sunday.getTime() + KST_OFFSET);
}

/** QuestSolve 기준 이번 주 발자국 [1,0,0,1 …] */
export async function buildFootprints(userId) {
  const todayKst = kstTodayMidnight();                               // 한국 자정

  //const weekStartKst = kstWeekStart(todayKst);       // 이번 주 일요일
  const weekStartKst = startOfWeek(todayKst, { weekStartsOn: 0 })  

  // DB는 UTC 저장 → KST → UTC(-9h)로 변환
  const weekStartUtc = new Date(weekStartKst.getTime() - KST_OFFSET);

  const solvedDates = await fetchSolvedDates({ userId, dateFrom: weekStartKst, dateTo: todayKst });
  const solvedSet = new Set(solvedDates.map(toKstKey));

  const len = differenceInCalendarDays(todayKst, weekStartKst) + 1;      // 일~오늘 길이
  return Array.from({ length: len }, (_, i) =>
    solvedSet.has(toKstKey(addDays(weekStartKst, i))) ? 1 : 0
  );
}

/** 연속 일수 (QuestSolve 기준) */
export async function getStreak(userId) {
  const today = kstTodayMidnight();             // 한국 자정
  const monthAgoUtc = subDays(today, 100); // 최근 100일만 조회 (필요시 확대)

  // YYYY-MM-DD 문자열 Set
  const solvedSet = new Set(
    (await fetchSolvedDates({ userId, dateFrom: monthAgoUtc, dateTo: today }))
      .map(toKstKey)
  );

  let streak = 0;
  let started = false;

  for (let d = new Date(today); ; d.setTime(d.getTime() - DAY_MS)) {
    const key = toKstKey(d);

    if (solvedSet.has(key)) {
      streak++;                // 오늘/어제/... 연속 풀이
      started = true;
    } else {
      if (started) break;      // 첫 끊김 → 종료
      // 아직 시작 안 했으면 (오늘 미풀이) 계속 어제로 이동
    }

    // 안전 장치: 조회 구간 넘어가면 종료
    if (d <= monthAgoUtc) break;
  }
  return streak;
}