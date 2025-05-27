import { startOfWeek } from 'date-fns';
import * as userRepo from '../repositories/userRepository.js';
import * as weeklyRankRepo from '../repositories/weeklyRankRepository.js';
import * as snapshotRepo from '../repositories/snapshotRepository.js';
import { AppError } from '../errors/AppError.js';


export async function updateWeeklyRank(userId) {
    const user = await userRepo.findUserById(userId);
    if (!user) throw new AppError('주간 랭킹 갱신: 존재하지 않는 사용자', 404);

    // 이번 주 스냅샷 유무 확인 
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });   // 일요일 00:00
    const base = await snapshotRepo.findLastSnapshotSince({ userId, weekStart });

    if (!base) {
        // 일요일 스냅샷이 아직 없으면 delta=0으로 upsert(처음 가입 직후 등)
        await weeklyRankRepo.upsertWeeklyRank({ user, delta: 0 });
        return;
    }

    const delta = user.solvedNum - base.solvedCount;
    await weeklyRankRepo.upsertWeeklyRank({ user, delta });
}

export async function getDepartmentWeeklyRanking() {
    const deptRanking = await weeklyRankRepo.getDeptTotalsThisWeek();

    return deptRanking.map(d => ({
        department: d.department,
        solvedThisWeek: d._sum.solvedThisWeek
    }));
}

export async function getStudentInDeptWeeklyRanking(department) {
    const studentRanking = await weeklyRankRepo.getDeptUserRanking(department);

    return studentRanking.map(s => ({
        name: s.user.name,
        solvedThisWeek: s.solvedThisWeek
    }))
}