import { syncSingleUser } from "../jobs/syncSolvedListJob.js";

export async function refreshSolvedInfoCtrl(req, res, next) {
    try {
        const userId = Number(req.params.id);
        await syncSingleUser(userId);             // Solved.ac <-> DB 
        res.status(200).json({ ok: true });
    } catch (error) {
        next(error);
    }
}

export async function refreshSolvedInfoSessionCtrl(req, res, next) {
    try {
        const userId = Number(req.session?.user?.id);
        await syncSingleUser(userId);             // Solved.ac <-> DB 
        res.status(200).json({ ok: true });
    } catch (error) {
        next(error);
    }
}