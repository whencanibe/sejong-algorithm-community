import * as userRepo from "../repositories/userRepository.js";
import { getRankandTier } from "./solvedacService.js";

let allTier = ['브론즈', '실버', '골드', '플래티넘', '다이아몬드', '루비'];
let allSubtier = ['V', "IV", 'III', 'II', 'I'];

async function stringifyTier(tierNum) {
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

    const enrollYear = user.enrollYear % 100;
    const tier = stringifyTier(rankInfo.tier);

    const [rank, rankInMajor] = await Promise.all([
      userRepo.getRankByUserId(user.id),
      userRepo.getRankInMajorByUserId(user.id),
    ]);

    return {
      baekjoonName: user.baekjoonName,
      name: user.name,
      major: user.major,
      enrollYear,
      tier,
      rank,
      rankInMajor,
    };
  } catch (err) {
    console.error("getUserInfo 에러:", err.message);
    throw err; // 컨트롤러로 넘겨주기
  }
}



