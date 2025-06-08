import prisma from '../models/prisma.js';

/**
 * 사용자가 현재 소유하고 있는 카드 ID 목록 조회
 * 
 * @param {number} userId - 사용자 ID
 * @returns {Promise<number[]>} - 사용자가 가진 카드 ID 배열
 */
export async function getUserCardIds(userId) {
  const cards = await prisma.userCard.findMany({
    where: { userId },
    select: { cardId: true }
  });
  return cards.map(c => c.cardId);    // 카드 ID만 추출하여 배열로 반환
}


export async function getRandomUnownedCard(userCardIds) {
  return await prisma.card.findFirst({
    where: {
      id: { notIn: userCardIds }
    },
    rderBy: { id: 'asc' }, skip: Math.random() * count
  });
}

/**
 * 특정 사용자에게 카드 지급
 * 
 * @param {number} userId - 사용자 ID
 * @param {number} cardId - 지급할 카드 ID
 * @returns {Promise<Object>} - 생성된 userCard 객체 (카드 정보 포함)
 */
export async function giveCardToUser(userId, cardId) {
  return await prisma.userCard.create({
    data: { userId, cardId },
    include: {
      card: true 
    }
  });
}