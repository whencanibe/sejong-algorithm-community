import * as userRepo from "../repositories/userRepository.js";
import * as weeklyRankRepo from "../repositories/weeklyRankRepository.js";
import * as solvedProblemRepo from "../repositories/solvedProblemRepository.js";
import { getRankandTier } from "./solvedacService.js";
import { startOfWeek, differenceInCalendarDays } from 'date-fns';

let allTier = ['브론즈', '실버', '골드', '플래티넘', '다이아몬드', '루비'];
let allSubtier = ['V', "IV", 'III', 'II', 'I'];

//db에 정수로 저장된 티어를 텍스트로 바꿔주는 함수
export function stringifyTier(tierNum) {
    let tier = 0;
    let subtier = 0;

    if (Number.isInteger(tierNum / 5)) {
        tier = Math.floor(tierNum / 5) - 1;
    } else {
        tier = Math.floor(tierNum / 5);
    }

    if (tierNum % 5 == 1) {
        subtier = 0;
    } else if (tierNum % 5 == 0) {
        subtier = 4;
    } else {
        subtier = (tierNum % 5) - 1;
    }

    return `${allTier[tier]} ${allSubtier[subtier]}`;
}

//연속 풀이 일수 계산하는 함수
function calcStreak(timestamps) {
  // 날짜 문자열 YYYY-MM-DD 만 뽑아서 집합에 넣음
  const days = new Set(
    timestamps.map(t =>
      t.toISOString().slice(0, 10)   // 예) 2025-05-15
    )
  );

  // 오늘 날짜부터 뒤로 한 날씩 이동하면서 체크
  let streak = 0;
  for (let d = new Date(); ; d.setDate(d.getDate() - 1)) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) streak++;
    else break;
  }
  return streak;
}

export async function getUserInfo(id) {
  try {
    const user = await userRepo.findUserById(id);
    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.");
    }

    let rankInfo;
    try {
      rankInfo = await getRankandTier(user.baekjoonName);
    } catch (err) {
      throw new Error("Solved.ac API 호출 실패");
    }

    const enrollYear = user.studentId.slice(0,2); // 학번 년도 예) 24
    const tier = stringifyTier(rankInfo.tier);

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // 이번 주 일요일 주의 시작으로 설정

    //병렬 처리 - 하나라도 실패하면 에러
    const [
      rank, 
      rankInDepartment,
      weeklySolved,
      weeklyRankInSchool,
      weeklyRankInDepartment,
      solvedDates
    ] = await Promise.all([
      userRepo.getRankByUserId(user.id), //rank
      userRepo.getRankInDepartmentByUserId(user.id), //rankInDepartment
      weeklyRankRepo.getMyWeeklySolved(user.id, weekStart), // weeklySolved
      weeklyRankRepo.getRank(user.id, weekStart, 'ALL'), // weeklyRankInSchool
      weeklyRankRepo.getRank(user.id, weekStart, user.department), //weeklyRankInDepartment
      solvedProblemRepo.getSolvedDates(user.id) //weeklyRankInDepartment
    ]);

    const streak = calcStreak(solvedDates.map(d => d.solvedAt));

    return {
      baekjoonName: user.baekjoonName,
      name: user.name,
      department: user.department,
      enrollYear,
      tier,
      rank,
      rankInDepartment,
      weeklySolved: weeklySolved.solvedThisWeek,
      weeklyRankInSchool,
      weeklyRankInDepartment,
      streak,
    };
  } catch (err) {
    console.error("getUserInfo 에러:", err.message);
    throw err; // 컨트롤러로 그대로 넘겨주기
  }
}


