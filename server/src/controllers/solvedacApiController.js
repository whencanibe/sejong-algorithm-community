import { getSolvedProblemIds, getRankandTier } from '../services/solvedacService.js';

/**
 * 특정 백준 사용자 핸들(handle)을 기반으로 푼 문제 목록을 가져오는 컨트롤러
 * - solved.ac에서 푼 문제 정보를 가져와 JSON 응답으로 반환합니다.
 *
 * @param {Request} req - Express 요청 객체 (params.handle: 백준 닉네임)
 * @param {Response} res - Express 응답 객체
 * @param {Function} next - Express 에러 핸들링 미들웨어
 */
export async function getSolvedProblemIdsCtrl(req, res, next) {
    try {
        const solvedProblems = await getSolvedProblemIds(req.params.handle); // { 백준 닉네임, 푼 문제 수, 문제 목록}
        res.status(201).json(solvedProblems);
    } catch (error) {
        next(error);
    }
}

/**
 * 특정 백준 사용자 핸들(handle)을 기반으로 티어 및 랭킹 정보를 반환하는 컨트롤러
 * - solved.ac에서 사용자 정보를 조회하여 클라이언트에 전달합니다.
 *
 * @param {Request} req - Express 요청 객체 (params.handle: 백준 닉네임)
 * @param {Response} res - Express 응답 객체
 * @param {Function} next - Express 에러 핸들링 미들웨어
 */
export async function getRankCtrl(req, res, next) {
    try {
        const rank = await getRankandTier(req.params.handle);
        res.status(201).json(rank);
    } catch (error) {
        next(error);
    }
}