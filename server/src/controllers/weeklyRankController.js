import { syncSingleUser } from "../jobs/syncSolvedListJob.js";
import { updateWeeklyRank } from "../services/weeklyRankService.js";

export async function refreshSolvedInfoCtrl(req, res, next) {
    try {
        await syncSingleUser(req.userId);             // Solved.ac <-> DB 
        await updateWeeklyRank(req.userId);   // WeeklyRank 갱신
        res.json({ ok: true });
    } catch (e) { next(e); }
}