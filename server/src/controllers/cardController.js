import { AppError } from '../errors/AppError.js';
import * as service from '../services/cardService.js';


/**
 * [POST] /cards/reward
 * 
 * 카드 보상 지급 요청 처리 컨트롤러
 * - 사용자가 조건(예: 도장 7개)을 충족했는지 확인하고
 *   보상을 받을 수 있다면 카드 1장을 지급
 * - 비즈니스 로직은 service.rewardCardIfEligible()에서 처리
 *
 * @param {Request} req - 세션에 로그인된 사용자 정보 포함
 * @param {Response} res - 카드 보상 결과 반환
 * @param {Function} next - 에러 처리 미들웨어로 전달
 */
export async function rewardCard(req, res, next) {
  try {
    const userId = req.session?.user?.id;

    if (!userId) {
      return next(new AppError('로그인이 필요합니다.', 401));
    }

    const stampCount = req.body.stampCount; // 프론트에서 받은 도장 개수
    
    // 서비스 레이어에서 조건 확인 및 카드 지급
    const result = await service.rewardCardIfEligible(userId, stampCount);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}
/**
 * [GET] /cards/me
 * 
 * 현재 로그인한 사용자가 소유한 카드 목록 조회
 * - 단순 조회만 하며, 필터링/랜덤화 등은 없음
 * - service.getUserCards(userId)를 통해 DB 접근
 *
 * @param {Request} req - 세션 기반 사용자 식별
 * @param {Response} res - 카드 목록(JSON) 반환
 * @param {Function} next - 에러 처리 미들웨어로 전달
 */
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