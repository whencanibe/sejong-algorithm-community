import prisma from '../models/prisma.js';

// 유저가 가지고 있는 카드 ID 목록 조회
export async function getUserCardIds(userId) {
  const cards = await prisma.userCard.findMany({
    where: { userId },
    select: { cardId: true }
  });
  return cards.map(c => c.cardId);
}

// 아직 보유하지 않은 카드 중 랜덤 카드 하나
export async function getRandomUnownedCard(userCardIds) {
  return await prisma.card.findFirst({
    where: {
      id: { notIn: userCardIds }
    },
    orderBy: { id: 'asc' } // 랜덤하고 싶으면: orderBy: { id: 'asc' }, skip: Math.random() * count
  });
}

// 유저에게 카드 한 장 지급
export async function giveCardToUser(userId, cardId) {
  return await prisma.userCard.create({
    data: { userId, cardId },
    include: {
      card: true // 프론트에 카드 정보 같이 주기 위함
    }
  });
}