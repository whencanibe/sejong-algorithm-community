import { syncSingleUser } from "../jobs/syncSolvedListJob.js";
import { updateWeeklyRank } from "../services/weeklyRankService.js";

export async function refreshSolvedInfoCtrl(req, res, next) {
    try {
        const userId = Number(req.params.id);
        await syncSingleUser(userId);             // Solved.ac <-> DB 
        await updateWeeklyRank(userId);   // WeeklyRank 갱신
        res.json({ ok: true });
    } catch (e) { next(e); }
}