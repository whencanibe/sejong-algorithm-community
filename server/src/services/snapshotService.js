import { startOfWeek } from 'date-fns';
import * as snapshotRepo from '../repositories/snapshotRepository.js';

// 서버 켰을 때나 신규 사용자들 이번 주 푼 문제 수 스냅샷 찍기 위한 함수
export async function ensureSnapshotForUser(user) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // 일요일 00:00

  // 이미 이번 주 스냅숏이 있는 지 확인
  const exists = await snapshotRepo.findLastSnapshotSince({
    userId: user.id,
    weekStart
  });

  if (!exists) {
    await snapshotRepo.createSnapshot({
      userId: user.id,
      solvedCount: user.solvedNum 
    });
  }
}