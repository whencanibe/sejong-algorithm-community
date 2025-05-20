import cron from 'node-cron';
import prisma from '../models/prisma.js';
import * as solvedacService from '../services/solvedacService.js';
import * as userRepo from '../repositories/userRepository.js';
import * as solvedProblemRepo from '../repositories/solvedProblemRepository.js';

export function startSyncSolvedList() {
    cron.schedule('0 15 * * *', syncAllUsers, { timezone: 'UTC' }); // 한국 시간 0시에 user 정보 동기화
}

export async function syncAllUsers() {
    const users = userRepo.findAllUsers();

    for (const user of users) {
        try {
            const profile = await solvedacService.getRankandTier(user.baekjoonName);

            await userRepo.updateUser(user.id, {
                solvedNum: profile.solvedCount,
                tier: profile.tier,
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
    const user = userRepo.findUserById(userId);
    try {
        const profile = await solvedacService.getRankandTier(user.baekjoonName);

        await userRepo.updateUser(user.id, {
            solvedNum: profile.solvedCount,
            tier: profile.tier,
            rank: profile.rank
        });

        const solvedList = await solvedacService.getSolvedProblemIds(user.baekjoonName);
        await olvedProblemRepo.saveSolvedProblem(user.id, solvedList.problemIds);
    } catch (error) {
        console.error('Solved.ac sync fail', user.baekjoonName, error.message);
    }
}

