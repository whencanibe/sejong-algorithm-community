import prisma from '../models/prisma.js';
import { startOfDay, endOfDay } from 'date-fns';

/**
 * 카드 보상 자격 확인 및 지급 처리 서비스
 * 
 * 조건:
 * - 스탬프 7개 이상이어야 함
 * - 오늘 이미 카드 받지 않은 경우
 * - 아직 받지 않은 카드가 존재할 경우
 *
 * 로직:
 * 1. 사용자의 오늘 카드 수령 여부 확인
 * 2. 사용자가 보유 중인 카드 확인
 * 3. 남은 카드 중 무작위 1장 지급
 *
 * @param {number} userId - 로그인한 사용자 ID
 * @param {number} stampCount - 사용자가 제출한 도장 수
 * @returns {object} 카드 지급 결과 및 상태 메시지
 */
export async function rewardCardIfEligible(userId, stampCount) {
  if (stampCount < 7) {
    return { eligible: false, message: '아직 도장이 부족합니다.' };
  }

  const today = startOfDay(new Date()); //카드를 여러장 받기 막기

  // 오늘 자정부터 하루의 끝까지 기준 (중복 수령 방지용)
  const todayCard = await prisma.userCard.findFirst({
    where: {
      userId,
      createdAt: {
        gte: startOfDay(new Date()),
        lte: endOfDay(new Date()),
      },
    },
  });

  if (todayCard) {
    return { eligible: false, message: '오늘은 이미 카드를 받았습니다.' };
  }

  // 기존 카드 확인
  const existingCards = await prisma.userCard.findMany({
    where: { userId },
  });

  const ownedCardIds = existingCards.map((uc) => uc.cardId);

    // 아직 소유하지 않은 카드들 조회
  const availableCards = await prisma.card.findMany({
    where: {
      id: {
        notIn: ownedCardIds,
      },
    },
  });

  if (availableCards.length === 0) {
    return { eligible: false, message: '모든 카드를 보유 중입니다.' };
  }

  // 소유하지 않은 카드 중 랜덤으로 하나 선택
  const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];

  await prisma.userCard.create({
    data: {
      userId,
      cardId: randomCard.id,
    },
  });

  return {
    eligible: true,
    card: randomCard,
  };
}

/**
 * 사용자가 가진 카드 전체 조회
 * 
 * - userCard 테이블에서 현재 사용자 ID 기준으로 조회
 * - 각 카드의 상세 정보(title, comment, image) 포함
 *
 * @param {number} userId
 * @returns {Array<{id, title, comment, image}>}
 */
export async function getUserCards(userId) {
  const userCards = await prisma.userCard.findMany({
    where: { userId },
    include: {
      card: true, 
    },
  });

  return userCards.map((uc) => ({
    id: uc.card.id,
    title: uc.card.title,
    comment: uc.card.comment,
    image: uc.card.image,
  }));
}