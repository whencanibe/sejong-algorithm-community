import * as userRepo from "../repositories/userRepository.js";
import * as weeklyRankRepo from "../repositories/weeklyRankRepository.js";
import * as solvedProblemRepo from "../repositories/solvedProblemRepository.js";
import { getRankandTier } from "./solvedacService.js";
import { startOfWeek, differenceInCalendarDays } from 'date-fns';
import { stringifyTier } from "../utils/stringifyTier.js";
import { getStreak } from "./footprintService.js";


export async function getUserInfo(userId) {
  try {
    const user = await userRepo.findUserById(userId);
    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.");
    }

    let rankInfo;
    try {
      rankInfo = await getRankandTier(user.baekjoonName);
    } catch (err) {
      throw new Error("Solved.ac API 호출 실패");
    }

    const enrollYear = user.studentId.slice(0, 2); // 학번 년도 예) 24
    const tier = stringifyTier(rankInfo.tier);

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // 이번 주 일요일 주의 시작으로 설정

    //병렬 처리 - 하나라도 실패하면 에러
    const [
      rank,
      rankInDepartment,
      weeklySolved,
      weeklyRankInSchool,
      weeklyRankInDepartment,
      solvedDates,
      streak,
      percentile,
    ] = await Promise.all([
      userRepo.getRankByUserId(userId),
      userRepo.getRankInDepartmentByUserId(userId),
      weeklyRankRepo.getMyWeeklySolved(userId, weekStart),
      weeklyRankRepo.getRank(userId, weekStart, 'ALL'),
      weeklyRankRepo.getRank(userId, weekStart, user.department),
      solvedProblemRepo.getSolvedDates(userId),
      getStreak(userId),
      userRepo.getPercentile(userId),
    ]);

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
      percentile
    };
  } catch (err) {
    console.error("getUserInfo 에러:", err.message);
    throw err; // 컨트롤러로 그대로 넘겨주기
  }
}

export async function getPercentilesForUser(userId) {

  try {
    const [percentileInTotal, percentileInDepartment] = await Promise.all([
      userRepo.getPercentile(userId),
      userRepo.getPercentileInDepartement(userId)
    ]);

    return {
      percentileInTotal,
      percentileInDepartment
    };
  } catch (error) {
    console.error("getPercentilesForUser 에러:", error.message);
    throw error;
  }
}


