import { getSolvedProblemIds } from "../services/solvedacService.js";

export async function getSolvedProblemIdsCtrl(req, res, next) {
    try {
        const solvedProblems = await getSolvedProblemIds(req.params.handle); // { 백준 닉네임, 푼 문제 수, 문제 목록}
        res.status(201).json(solvedProblems);
    } catch (error) {
        if(error.message === '해결문제목록불러오기실패'){
            return res.status(409).json({ error: '해결 문제목록 불러오기 실패' });
        }
        next(error);
    }
}