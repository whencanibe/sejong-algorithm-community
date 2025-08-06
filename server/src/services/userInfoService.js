import prisma from '../models/prisma.js';
import Prisma from '../models/prisma.js';
import * as userRepo from '../repositories/userRepository.js';
import * as solvedProblemRepo from '../repositories/solvedProblemRepository.js';
import { getRankandTier } from './solvedacService.js';
import { startOfWeek, differenceInCalendarDays } from 'date-fns';
import { stringifyTier } from '../utils/stringifyTier.js';
import { getStreak } from './footprintService.js';
import { findUserById } from '../repositories/userRepository.js';
import { AppError } from '../errors/AppError.js';
import { ExternalError } from '../errors/ExternalError.js';

/**
 * 주어진 사용자 ID에 대한 상세 정보를 반환하는 함수
 * - 사용자 정보 조회
 * - solved.ac에서 티어 및 푼 문제 수 조회
 * - 학교 내 랭킹, 학과 랭킹, 연속 풀이일, 백분위 계산 등 포함
 *
 * @param {number} userId - 사용자 고유 ID
 * @returns {Promise<Object>} 사용자 상세 정보 객체
 */
export async function getUserInfo(userId) {
  let user;
  try {
    // 사용자 정보 조회
    user = await userRepo.findUserById(userId);
  } catch (err) {                        
    // Prisma 관련 오류를 식별해 세분화 처리
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError('DB 조회 오류', 500, { cause: err });
    }
    // 알 수 없는 오류는 그대로 throw
    throw err;                            
  }
  
  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다.', 404);
  }

  let rankInfo;
  try {
    // 외부 API를 통해 랭킹, 티어 정보 조회
    rankInfo = await getRankandTier(user.baekjoonName);
  } catch (err) {
    throw new ExternalError('Solved.ac API 호출 실패', 10);
  }

  //학번에서 입학년도 추출 (예: "24011776" -> "24")
  const enrollYear = user.studentId.slice(0, 2);

  // 티어 정보 문자열로 변환
  const tier = stringifyTier(rankInfo.tier);

  // 총 푼 문제 수
  const totalSolvedCount = rankInfo.solvedCount;

  //병렬로 유저 정보 조회 (모두 성공해야 함 => 아니면 에러)
  const [
    rank, // 전체 사용자 중 순위
    rankInDepartment, // 학과 내 순위
    solvedDates, // 문제를 푼 날짜 배열
    streak, // 연속 풀이일 수
    percentile // 상위 백분위
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

/**
 * 사용자 ID를 기반으로 전체 사용자 중 퍼센트와
 * 소속 학과 내 퍼센트를 병렬로 조회합니다.
 *
 * @param {number} userId - 사용자 고유 ID
 * @returns {Promise<{percentileInTotal: number, percentileInDepartment: number}>}
 *          - 전체 중 상위 퍼센트와 학과 내 퍼센트
 */
export async function getPercentilesForUser(userId) {

  try {
    const [percentileInTotal, percentileInDepartment] = await Promise.all([
      userRepo.getPercentile(userId),
      userRepo.getPercentileInDepartment(userId)
    ]);

    return {
      percentileInTotal,
      percentileInDepartment
    };
  } catch (error) {
    console.error('getPercentilesForUser 에러:', error.message);
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

/**
 * 사용자의 기본 정보(이름, 학과, 프로필 이미지)를 조회합니다.
 * 
 * @param {number} userId - 조회할 사용자 ID
 * @returns {Object} 사용자 기본 정보 객체 { name, department, profileImage }
 * @throws {AppError} 유저가 존재하지 않을 경우 404 에러 발생
 */
export async function getBasicUserInfo(userId) {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new AppError('유저를 찾을 수 없습니다.', 404);
  const defaultProfileImage = '/기본이미지.png'; 

  return {
    name: user.name,
    department: user.department,
    profileImage: user.profileImage,
  };
}

/**
 * 전체 사용자 중 상위 랭킹 정보를 조회합니다.
 *
 * @param {number} limit - 가져올 랭킹 수 (예: 상위 10명)
 * @returns {Promise<Array>} - 랭킹 사용자 목록
 */
export async function getGlobalRankingServ(limit) {
  return await userRepo.getGlobalRanking(limit);
}

/**
 * 특정 학과(dept) 내 상위 랭킹 정보를 조회합니다.
 *
 * @param {string} dept - 학과 이름
 * @param {number} limit - 가져올 랭킹 수 (예: 상위 10명)
 * @returns {Promise<Array>} - 학과 랭킹 사용자 목록
 */
export async function getDepartmentRankingServ(dept, limit) {
  return await userRepo.getDepartmentRanking(dept,limit);
}

export async function updateNickname(userId, newName) {
  // 중복 닉네임 체크를 먼저 수행하고,
  const existing = await prisma.user.findFirst({
    where: { name: newName },
  });

  // 존재 여부를 판단
  if (existing && existing.id !== userId) {
    throw new AppError('이미 존재닉입니다.', 400);
  }

  // 닉네임 업데이트
  return await prisma.user.update({
    where: { id: Number(userId) },
    data: { name: newName },
  });
}

