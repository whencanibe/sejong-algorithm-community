import { startOfWeek } from 'date-fns';
import * as userRepo from '../repositories/userRepository.js';
import * as weeklyRankRepo from '../repositories/weeklyRankRepository.js';
import * as snapshotRepo from '../repositories/snapshotRepository.js';

export async function updateWeeklyRank(userId) {
    const user = await userRepo.findUserById(userId);
    
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });

    const base = snapshotRepo.findLastSnapshotSince({userId : user.id, weekStart});

    const delta = user.solvedNum - base.solvedCount;
    await weeklyRankRepo.upsertWeeklyRank({user, delta});
}