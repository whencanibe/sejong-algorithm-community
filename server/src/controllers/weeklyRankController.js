import { syncSingleUser } from "../jobs/syncSolvedListJob.js";
import { getDepartmentWeeklyRanking, getStudentInDeptWeeklyRanking, updateWeeklyRank } from "../services/weeklyRankService.js";

export async function refreshSolvedInfoCtrl(req, res, next) {
    try {
        const userId = Number(req.params.id);
        await syncSingleUser(userId);             // Solved.ac <-> DB 
        await updateWeeklyRank(userId);   // WeeklyRank 갱신
        res.json({ ok: true });
    } catch (e) { next(e); }
}

export async function getDepartmentWeeklyRankingCtrl(req, res, next) {
    try {
        const ranking = await getDepartmentWeeklyRanking();
        res.status(201).json(ranking);
    } catch (error) {
        next(error);
    }
}

//추후에 문자열이 정해진 학과들에 포함되는지 확인해야함.
export async function getStudentInDeptWeeklyRankingCtrl(req, res, next) {
    try {
        const ranking = await getStudentInDeptWeeklyRanking(req.params.department);
        res.status(201).json(ranking);
    } catch (error) {
        next(error);
    }
}

export async function refreshSolvedInfoSessionCtrl(req, res, next) {
    try {
        const userId = Number(req.session?.user?.id);
        await syncSingleUser(userId);             // Solved.ac <-> DB 
        await updateWeeklyRank(userId);   // WeeklyRank 갱신
        res.json({ ok: true });
    } catch (e) { next(e); }
}