import * as service from '../services/cardService.js';

export async function rewardCard(req, res) {
  const userId = req.session.user?.id;
  const stampCount = req.body.stampCount; // 프론트에서 도장 개수 넘겨줘야 함


  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다' });
  }

  const result = await service.rewardCardIfEligible(userId, stampCount);
  res.json(result);
}
export async function getUserCardList(req, res) {
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다' });
  }

  const cards = await service.getUserCards(userId);
  res.json(cards);
}