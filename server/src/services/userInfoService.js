import prisma from '../models/prisma.js';
import * as userRepo from "../repositories/userRepository.js";
import * as weeklyRankRepo from "../repositories/weeklyRankRepository.js";
import * as solvedProblemRepo from "../repositories/solvedProblemRepository.js";
import { getRankandTier } from "./solvedacService.js";
import { startOfWeek, differenceInCalendarDays } from 'date-fns';
import { stringifyTier } from "../utils/stringifyTier.js";
import { getStreak } from "./footprintService.js";
import { findUserById } from '../repositories/userRepository.js';
import { AppError } from "../errors/AppError.js";
import { ExternalError } from "../errors/ExternalError.js";

export async function getUserInfo(userId) {
  let user;
  try {
    user = await userRepo.findUserById(userId);
  } catch (err) {                         // Prisma 오류 세분화
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError('DB 조회 오류', 500, { cause: err });
    }
    throw err;                            // 모르는 오류는 그대로
  }
  
  if (!user) {
    throw new AppError("사용자를 찾을 수 없습니다.", 404);
  }

  let rankInfo;
  try {
    rankInfo = await getRankandTier(user.baekjoonName);
  } catch (err) {
    throw new ExternalError('Solved.ac API 호출 실패', 10);
  }

  const enrollYear = user.studentId.slice(0, 2); // 학번 년도 예) 24
  const tier = stringifyTier(rankInfo.tier);

  const totalSolvedCount = rankInfo.solvedCount;

  //병렬 처리 - 하나라도 실패하면 에러
  const [
    rank,
    rankInDepartment,
    solvedDates,
    streak,
    percentile
  ] = await Promise.all([
    userRepo.getRankByUserId(userId),
    userRepo.getRankInDepartmentByUserId(userId),
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
    streak,
    percentile,
    totalSolvedCount,
    profileImage: user.profileImage
  };
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
    throw new AppError('사용자 상위 퍼센트 불러오기 실패하였습니다.', 404);
  }
}

export async function updateUserProfileImage(userId, imageUrl) {
  try {
    const updated = await userRepo.updateUserProfileImage(userId, imageUrl);
    if (!updated) {
      throw new AppError('이미지 업로드: 해당 사용자를 찾을 수 없습니다.', 404);
    }

    return updated;
  } catch (err) { // DB관련 예상치 못한 에러를 잡기 위한 catch 문
    // DB관련 에러일 경우 내부 서버 에러로 전환하여 던지기
    if (err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002') {
      throw new AppError('이미 사용 중인 이미지 URL 입니다.', 409);
    }
    // 나머지 경우 내부 서버 에러로 전환하여 던지기
    throw new AppError('프로필 이미지 변경 중 오류가 발생했습니다.', 500);
  }

}

export async function getBasicUserInfo(userId) {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new AppError("유저를 찾을 수 없습니다.", 404);
  const defaultProfileImage = "/기본이미지.png"; 

  return {
    name: user.name,
    department: user.department,
    profileImage: user.profileImage,
  };
}

export async function getGlobalRankingServ(limit) {
  return await userRepo.getGlobalRanking(limit);
}

export async function getDepartmentRankingServ(dept, limit) {
  return await userRepo.getDepartmentRanking(dept,limit);
}

export async function updateNickname(userId, newName) {
  // 중복 닉네임 체크를 먼저 수행하고,
  const existing = await prisma.user.findFirst({
    where: { name: newName },
  });

  // 그런 다음 존재 여부를 판단해야 함
  if (existing && existing.id !== userId) {
    throw new AppError('이미 존재닉입니다.', 400);
  }

  // 닉네임 업데이트
  return await prisma.user.update({
    where: { id: Number(userId) },
    data: { name: newName },
  });
}

