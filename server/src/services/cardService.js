import * as repo from '../repositories/cardRepository.js';

export async function rewardCard(userId, stampCount) {
  if (stampCount < 7) {
    throw new Error('도장 7개가 필요합니다');
  }

  const ownedCardIds = await repo.getUserCardIds(userId);
  const newCard = await repo.getRandomUnownedCard(ownedCardIds);

  if (!newCard) {
    return null; // 모든 카드 이미 보유
  }

  const given = await repo.giveCardToUser(userId, newCard.id);
  return given.card;
}