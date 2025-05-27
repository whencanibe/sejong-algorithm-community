import * as service from '../services/cardService.js';

export async function giveCard(req, res) {
  const userId = req.session.user?.id;
  const { stampCount } = req.body;

  if (!userId) {
    return res.status(401).json({ error: '로그인 필요' });
  }

  try {
    const card = await service.rewardCard(userId, stampCount);
    if (!card) {
      return res.json({ message: '모든 카드를 이미 보유하고 있습니다.' });
    }
    res.status(201).json({ card });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}