import { signup } from "../services/userService.js";

export async function signupCtrl(req, res, next) {
    try {
        const user = await signup(req.body) // {email, password, name, baekjoonName}
        res.status(201).json(user);
    } catch (error) {
        if (error.message === '중복이메일') {
            return res.status(409).json({ error: '존재하는 이메일' });
        }
        next(error);
    }
}
