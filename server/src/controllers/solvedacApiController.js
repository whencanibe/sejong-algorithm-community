import { getSolvedProblemIds, getRank } from "../services/solvedacService.js";

export async function getSolvedProblemIdsCtrl(req, res, next) {
    try {
        const solvedProblems = await getSolvedProblemIds(req.params.handle); // { 백준 닉네임, 푼 문제 수, 문제 목록}
        res.status(201).json(solvedProblems);
    } catch (error) {
        if (error.message === '문제 목록 불러오기 실패') {
            return res.status(409).json({ error: '해결 문제목록 불러오기 실패' });
        }
        next(error);
    }
}

export async function getRankCtrl(req, res, next) {
    try {
        const rank = await getRank(req.params.handle);
        res.status(201).json(rank);
    } catch (error) {
        if (error.message === '사용자 랭킹 불러오기 실패') {
            return res.status(409).json({ error: '랭킹 불러오기 실패' });
        }
    }
}