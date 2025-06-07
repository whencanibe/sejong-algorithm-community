import cron from 'node-cron';
import prisma from '../models/prisma.js';
import * as solvedacService from '../services/solvedacService.js';
import * as userRepo from '../repositories/userRepository.js';
import * as solvedProblemRepo from '../repositories/solvedProblemRepository.js';
import { stringifyTier } from '../utils/stringifyTier.js';
import { AppError } from '../errors/AppError.js';
import { ExternalError } from '../errors/ExternalError.js';

export function startSyncSolvedList() {
    cron.schedule('0 15 * * *', syncAllUsers, { timezone: 'UTC' }); // 한국 시간 0시에 user 정보 동기화
}

/**
 * 전체 사용자에 대해 Solved.ac 데이터와 동기화합니다.
 * - 사용자 정보를 업데이트하고, 푼 문제 기록도 저장합니다.
 * - 순차적으로 각 사용자에 대해 `syncSingleUser`와 유사한 작업을 수행합니다.
 *
 * @throws {ExternalError} - Solved.ac API에서 요청 제한 발생 시 중단
 */
export async function syncAllUsers() {
    const users = await userRepo.findAllUsers();

    // 각 사용자에 대해 동기화 수행
    for (const user of users) {
        try {
            const profile = await solvedacService.getRankandTier(user.baekjoonName);

            // User 테이블 업데이트
            const updatedUser = await userRepo.updateUser(user.id, {
                solvedNum: profile.solvedCount,
                tier: stringifyTier(profile.tier),
                rank: profile.rank
            });

            const solvedList = await solvedacService.getSolvedProblemIds(user.baekjoonName);
            await solvedProblemRepo.saveSolvedProblemsBulk(user.id, solvedList.problemIds);

        } catch (error) {
            if (error.isAxiosError) {
                // axios 에러면 응답코드 체크
                const sec = error.response?.headers['retry-after'] ?? null;
                throw new ExternalError(`Solved.ac (${error.response?.status})`, sec);
            }
            console.error('Solved.ac sync fail', user.baekjoonName, error.message);
            // 나머지는 시스템 오류로 그대로 throw
            throw error;
        }
    }
}

/**
 * Solved.ac API를 이용해 단일 사용자 정보를 동기화합니다.
 * - 사용자 정보를 최신 상태로 업데이트하고,
 * - 푼 문제 목록도 저장합니다.
 *
 * @param {number} userId - 동기화할 사용자 ID
 * @throws {AppError} - 사용자가 존재하지 않을 경우
 * @throws {ExternalError} - Solved.ac 요청 제한 등의 외부 오류
 */
export async function syncSingleUser(userId) {
    const user = await userRepo.findUserById(userId);
    if (!user) throw new AppError('사용자 동기화: 존재하지 않는 사용자', 404);

    try {
        // Solved.ac에서 티어, 랭크, 푼 문제 수 가져오기
        const profile = await solvedacService.getRankandTier(user.baekjoonName);
        // User 테이블 갱신
        const updatedUser = await userRepo.updateUser(user.id, {
            solvedNum: profile.solvedCount,
            tier: stringifyTier(profile.tier),
            rank: profile.rank
        });

        // 사용자가 푼 문제 ID 목록 가져오기
        const solvedList = await solvedacService.getSolvedProblemIds(user.baekjoonName);
        // 푼 문제 목록을 DB에 저장 
        await solvedProblemRepo.saveSolvedProblemsBulk(user.id, solvedList.problemIds);

    } catch (error) {
        if (error.isAxiosError) {
            // axios 에러면 응답코드 체크
            const sec = error.response?.headers['retry-after'] ?? null;
            throw new ExternalError(`Solved.ac (${error.response?.status})`, sec);
        }
        console.error('Solved.ac sync fail', user.baekjoonName, error.message);
        // 나머지는 시스템 오류로 그대로 throw
        throw error;

    }
}

