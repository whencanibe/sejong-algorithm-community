import { AppError } from '../errors/AppError.js';
import * as service from '../services/cardService.js';

export async function rewardCard(req, res, next) {
  try {
    const userId = req.session?.user?.id;

    if (!userId) {
      return next(new AppError('로그인이 필요합니다.', 401));
    }

    const stampCount = req.body.stampCount; // 프론트에서 도장 개수 넘겨줘야 함

    const result = await service.rewardCardIfEligible(userId, stampCount);
    return res.json(result);
  } catch (error) {
    next(error);
  }

}
export async function getUserCardList(req, res, next) {
  try {
    const userId = req.session?.user?.id;

    if (!userId) {
      return next(new AppError('로그인이 필요합니다.', 401));
    }

    const cards = await service.getUserCards(userId);
    return res.json(cards);
  } catch (error) {
    next(error);
  }
}