import { getSolvedProblemIds, getRankandTier } from "../services/solvedacService.js";

export async function getSolvedProblemIdsCtrl(req, res, next) {
    try {
        const solvedProblems = await getSolvedProblemIds(req.params.handle); // { 백준 닉네임, 푼 문제 수, 문제 목록}
        res.status(201).json(solvedProblems);
    } catch (error) {
        next(error);
    }
}

export async function getRankCtrl(req, res, next) {
    try {
        const rank = await getRankandTier(req.params.handle);
        res.status(201).json(rank);
    } catch (error) {
        next(error);
    }
}