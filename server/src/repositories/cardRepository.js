import prisma from '../models/prisma.js';

export async function getUserCardIds(userId) {
  const cards = await prisma.userCard.findMany({
    where: { userId },
    select: { cardId: true }
  });
  return cards.map(c => c.cardId);
}

export async function getRandomUnownedCard(userCardIds) {
  return await prisma.card.findFirst({
    where: {
      id: { notIn: userCardIds }
    },
    rderBy: { id: 'asc' }, skip: Math.random() * count
  });
}

export async function giveCardToUser(userId, cardId) {
  return await prisma.userCard.create({
    data: { userId, cardId },
    include: {
      card: true 
    }
  });
}