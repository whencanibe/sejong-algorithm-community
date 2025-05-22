import cron from 'node-cron';
import prisma from '../models/prisma.js';
import * as solvedacService from '../services/solvedacService.js';
import * as userRepo from '../repositories/userRepository.js';
import * as solvedProblemRepo from '../repositories/solvedProblemRepository.js';
import { stringifyTier } from '../services/userInfoService.js';
import { AppError } from '../errors/AppError.js';
import { ExternalError } from '../errors/ExternalError.js';
import { ensureSnapshotForUser } from '../services/snapshotService.js';

export function startSyncSolvedList() {
    cron.schedule('0 15 * * *', syncAllUsers, { timezone: 'UTC' }); // 한국 시간 0시에 user 정보 동기화
}

export async function syncAllUsers() {
    const users = userRepo.findAllUsers();

    for (const user of users) {
        try {
            const profile = await solvedacService.getRankandTier(user.baekjoonName);
            const tier = stringifyTier(profile.tier);
            await userRepo.updateUser(user.id, {
                solvedNum: profile.solvedCount,
                tier: tier,
                rank: profile.rank
            });

            const solvedList = await solvedacService.getSolvedProblemIds(user.baekjoonName);
            await solvedProblemRepo.saveSolvedProblemsBulk(user.id, solvedList.problemIds);
        } catch (error) {
            console.error('Solved.ac sync fail', user.baekjoonName, error.message);
        }
    }
}

export async function syncSingleUser(userId) {
    const user = await userRepo.findUserById(userId);
    if (!user) throw new AppError('사용자 동기화: 존재하지 않는 사용자', 404);

    try {
        const profile = await solvedacService.getRankandTier(user.baekjoonName);
        // User 테이블 갱신
        const updatedUser = await userRepo.updateUser(user.id, {
            solvedNum: profile.solvedCount,
            tier: stringifyTier(profile.tier),
            rank: profile.rank
        });

        const solvedList = await solvedacService.getSolvedProblemIds(user.baekjoonName);
        await solvedProblemRepo.saveSolvedProblemsBulk(user.id, solvedList.problemIds);

        await ensureSnapshotForUser(updatedUser);  //이번주 기준 푼 문제 계산 위해 현재 문제 개수 db에 저장
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

