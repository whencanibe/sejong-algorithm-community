import prisma from '../models/prisma.js';

export async function rewardCardIfEligible(userId, stampCount) {
  if (stampCount < 7) {
    return { eligible: false, message: '아직 도장이 부족합니다.' };
  }

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