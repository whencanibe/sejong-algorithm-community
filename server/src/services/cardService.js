import prisma from '../models/prisma.js';
import { startOfDay, endOfDay } from 'date-fns';
export async function rewardCardIfEligible(userId, stampCount) {
  if (stampCount < 7) {
    return { eligible: false, message: '아직 도장이 부족합니다.' };
  }

  const today = startOfDay(new Date()); //카드를 여러장 받기 막기

  // ✅ 오늘 카드 받은 적 있는지 확인
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

  // ✅ 기존 카드 확인
  const existingCards = await prisma.userCard.findMany({
    where: { userId },
  });

  const ownedCardIds = existingCards.map((uc) => uc.cardId);

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