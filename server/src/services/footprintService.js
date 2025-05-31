import { startOfWeek, differenceInCalendarDays, addDays, subDays } from 'date-fns';
import { fetchSolvedDates } from '../repositories/questSolveRepository.js';
import { kstMidnight } from '../utils/utcTodayMidnight.js';


// YYYY-MM-DD 예) 2025-05-31 형식으로 문자열 반환 하는 함수
const toUtcKey = d =>
  (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10); //타입이 날짜이면 그대로 쓰고 아니면 날짜로 변환 후, 문자열로 변환


export async function buildFootprints(userId) {
  const todayUtc = kstMidnight(); // 오늘 자정을 UTC로 저장: 오늘 2025-05-31 00:00 KST => 2025-05-30 15:00:00 UTC             
  const weekStart = startOfWeek(todayUtc, { weekStartsOn: 0 }); // 오늘 날짜가 포함된 주의 첫 날

  const solvedDates = await fetchSolvedDates({
    userId,
    dateFrom: weekStart,   //UTC
    dateTo: addDays(todayUtc, 1) // 오늘 UTC 23:59:59초 까지
  });

  // O(1) 조회를 위하여 해시테이블로 구현된 집합 사용
  const solvedSet = new Set(solvedDates.map(toUtcKey));

  // 반환될 배열의 길이를 정하기 위해서 
  const len = differenceInCalendarDays(todayUtc, weekStart) + 1;

  // 길이는 len 인 배열 - 오늘이 수요일이면 일월화수 => 길이 4인 배열
  // solvedSet에 날짜가 있으면 1 없으면 0 반환
  const result = Array.from({ length: len }, (_, i) =>
    solvedSet.has(toUtcKey(addDays(weekStart, i))) ? 1 : 0
  );

  return result;
}


export async function getStreak(userId) {
  const todayUtc = kstMidnight();
  const yesterdayUtc = subDays(todayUtc, 1);      
  const pastUtc = subDays(todayUtc, 100);       // 최근 100일만 조회

  const solvedSet = new Set(
    (await fetchSolvedDates({ userId, dateFrom: pastUtc, dateTo: todayUtc }))
      .map(toUtcKey)
  );

  let streak = 0;
  let started = false; // 첫 solved 발견 여부

  
  if (!solvedSet.has(toUtcKey(yesterdayUtc)) && !solvedSet.has(toUtcKey(todayUtc))){
    return 0;
  }

  //오늘부터 거꾸로 하루씩 거슬러가며 연속 일 수 계산
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
