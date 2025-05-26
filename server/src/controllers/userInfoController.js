import { getUserInfo } from "../services/userInfoService.js";
import { buildFootprints } from '../service/footprintService.js';

export async function getUserInfoCtrl(req, res, next) {
    try {
        const userId = Number(req.params.id);
        const userInfo = await getUserInfo(userId);
        res.status(201).json(userInfo);
    } catch (error) {
        res.status(404).json({ error: error.message || '사용자 정보 조회 실패' });
    }
}

export async function getFootprintsCtrl(req, res, next) {
    try {
        const userId = Number(req.params.id);
        const footprints = await buildFootprints(userId);
        res.status(201).json({ footprints });
    } catch (e) { next(e); }
}