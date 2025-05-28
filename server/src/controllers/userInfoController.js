import { getPercentilesForUser, getUserInfo } from "../services/userInfoService.js"; 

export async function getUserInfoCtrl(req, res, next) {
    try {
        const userId = Number(req.params.id);
        const userInfo = await getUserInfo(userId);
        res.status(201).json(userInfo);
    } catch (error) {
        res.status(404).json({ error: error.message || '사용자 정보 조회 실패' });
    }
}

export async function getPercentilesForUserCtrl(req, res, next) {
    try {
        const userId = Number(req.params.id);
        const percentiles = await getPercentilesForUser(userId);
        res.status(201).json(percentiles);
    } catch (error) {
        res.status(404).json({ error: error.message || '상위 퍼센트 조회 실패' });
    }
}

export async function getUserInfoSessionCtrl(req, res, next) {
    try {
        const userId = Number(req.session?.user?.id);
        const userInfo = await getUserInfo(userId);
        res.status(201).json(userInfo);
    } catch (error) {
        res.status(404).json({ error: error.message || '사용자 정보 조회 실패' });
    }
}

export async function getPercentilesForUserSessionCtrl(req, res, next) {
    try {
        const userId = Number(req.session?.user?.id);
        const percentiles = await getPercentilesForUser(userId);
        res.status(201).json(percentiles);
    } catch (error) {
        res.status(404).json({ error: error.message || '상위 퍼센트 조회 실패' });
    }
}