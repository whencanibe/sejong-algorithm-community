import { getUserInfo } from "../services/userInfoService.js"; 

export async function getUserInfoCtrl(req, res, next) {
    try {
        const userInfo = await getUserInfo(req.params.id)
        res.status(201).json(userInfo);
    } catch (error) {
        res.status(404).json({ error: err.message || '사용자 정보 조회 실패' });
    }
}
