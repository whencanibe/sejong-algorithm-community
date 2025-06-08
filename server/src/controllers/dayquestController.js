import { syncSingleUser } from '../jobs/syncSolvedListJob.js';
import { getDailyQuest, getDayquestStatus } from '../services/dayquestService.js';
import { buildFootprints, getStreak } from '../services/footprintService.js';


export async function getDayquestStatusCtrl(req, res, next) {
  try {
    const userId = req.session?.user?.id;

    const result = await getDayquestStatus(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * 세션에 저장된 사용자 ID를 기반으로 주간 풀이 기록(footprints)을 반환하는 컨트롤러
 * - 최근 일주일 동안 문제를 푼 날짜에 따라 0/1로 구성된 배열을 제공합니다.
 *
 * @param {Request} req - Express 요청 객체 (세션에서 사용자 ID 추출)
 * @param {Response} res - Express 응답 객체
 * @param {Function} next - 에러 핸들링 미들웨어
 */
export async function getFootprintsSessionCtrl(req, res, next) {
  try {
    const userId = Number(req.session?.user?.id);
    const footprints = await buildFootprints(userId);
    res.status(201).json({ footprints });
  } catch (e) { next(e); }
}

/**
 * 세션 기반으로 현재 사용자의 연속 풀이 일수(streak)를 반환하는 컨트롤러
 * - 최근 100일 중 연속적으로 문제를 푼 일 수를 계산합니다.
 *
 * @param {Request} req - Express 요청 객체 (세션에 user.id 포함)
 * @param {Response} res - Express 응답 객체
 * @param {Function} next - 에러 핸들링 미들웨어
 */
export async function getStreakSessionCtrl(req, res, next) {
  try {
    const userId = Number(req.session?.user?.id);
    const streak = await getStreak(userId);
    res.status(201).json({ streak });
  } catch (error) {
    next(error);
  }
}

export async function refreshDailyQuestCtrl(req, res, next) {
  try {
    const userId = req.session?.user?.id;
    await syncSingleUser(userId);         
        
    const status = await getDayquestStatus(userId);
    res.json(status);                     
  } catch (e) { next(e); }
}

/**
 * 오늘의 데일리 퀘스트 문제를 반환하는 컨트롤러
 * - getDailyQuest()를 호출해 문제 ID와 제목을 받아 클라이언트에 응답합니다.
 *
 * @param {Request} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 * @param {Function} next - 에러 핸들링 미들웨어
 */
export async function getDailyQuestCtrl(req, res, next) {
  try {
    const response = await getDailyQuest();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}