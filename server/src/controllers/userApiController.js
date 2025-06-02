import { AppError } from "../errors/AppError.js";
import { signupService } from "../services/userService.js";
import { loginService } from '../services/userService.js';

export const signup = async (req, res, next) => {
  try {
    const newUser = await signupService(req.body);

    res.status(201).json({
      message: "회원가입 성공",
      user: {
        id: newUser.id,
        email: newUser.email,
      }
    });
  } catch (err) {
    console.error("회원가입 오류:", err);
    next(err);
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginService(email, password);

    req.session.user = {
      id: user.id,
      email: user.email,
    };

    res.status(200).json({
      success: true,
      message: '로그인 성공',
      user: req.session.user,
    });
  } catch (err) {
    console.error("로그인 오류:", err);
    next(err);
  }
};

export const logout = (req, res, next) => {
  // 콜백안에서 에러는 try catch로 잡을 수 없으므로 다음과 같이 에러 처리
  req.session.destroy(err => {
    if (err) {
      console.error("로그아웃 실패:", err);
      return next(err);
    }

    res.clearCookie('connect.sid');
    res.status(200).json({ message: "로그아웃 성공" });
  });
};

// 동기 함수이므로 try catch 필요 없음
export const getMyInfo = (req, res, next) => {
  if (!req.session.user) {
    const err = new AppError('로그인이 필요합니다.', 401);
    return next(err);
  }

  res.status(200).json({
    message: "로그인된 사용자 정보",
    user: req.session.user,
  });
};