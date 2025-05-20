import cron from 'node-cron';
import { startOfWeek } from 'date-fns';
import prisma from '../models/prisma.js';
import * as userRepo from '../repositories/userRepository.js';
import * as snapshotRepo from '../repositories/snapShotRepository.js';
import * as weeklyRankRepo from '../repositories/weeklyRankRepository.js';

export function startWeeklySnapshot() {
    cron.schedule('5 15 * * 6', weeklySnapShotsBulk, { timezone: 'UTC' }); // 한국 시간 일요일 0시 5분
}

async function weeklySnapshotsBulk() {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // 일요일 00:00
    const users = userRepo.findAllUsers();

    //일요일 정각기준 유저 푼 문제 저장해놓기
    for (const user of users) {
        snapshotRepo.createSnapshot({ userId: user.id, solvedCount: user.solvedNum });

        const last = snapshotRepo.findSecondLastSnapshot(user.id);

        const delta = user.solvedNum - (last?.solvedCount ?? 0);

        const data = [
            { weekStart, department: user.department, userId: user.id, solvedThisWeek: delta },
            { weekStart, department: 'ALL', userId: user.id, solvedThisWeek: delta }, // 학과, 전체 별 랭킹 구할 때 성능을 위해 'ALL'로 한번 더 저장
        ]
        weeklyRankRepo.createWeeklyRanksBulk(data);
    }


}
