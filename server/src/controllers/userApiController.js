import { AppError } from '../errors/AppError.js';
import { signupService } from '../services/userService.js';
import { loginService } from '../services/userService.js';

/**
 * [POST] /signup
 * - 클라이언트로부터 전달받은 사용자 정보를 바탕으로 회원가입을 수행합니다.
 * - 사용자 입력(req.body)을 받아 signupService 호출
 * - 회원가입 성공 시, 신규 사용자 정보(ID, email) 반환
 */
export const signup = async (req, res, next) => {
  try {
    const newUser = await signupService(req.body);

    res.status(201).json({
      message: '회원가입 성공',
      user: {
        id: newUser.id,
        email: newUser.email,
      }
    });
  } catch (err) {
    console.error('회원가입 오류:', err);
    next(err);
  }
};

/**
 * [POST] /login
 * - 클라이언트로부터 받은 자격 증명(email, password)을 기반으로 로그인 처리
 * - 로그인 성공 시, 사용자 정보를 세션에 저장하여 인증 상태 유지
 * - 실패 시 적절한 예외 발생 (예: 비밀번호 불일치, 이메일 미등록 등)
 */
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
    console.error('로그인 오류:', err);
    next(err);
  }
};

/**
 * [GET] /logout
 * - 세션 제거를 통해 로그아웃 처리
 * - 세션 삭제 후 쿠키도 제거
 */
export const logout = (req, res, next) => {
  // 콜백안에서 에러는 try catch로 잡을 수 없으므로 다음과 같이 에러 처리
  req.session.destroy(err => {
    if (err) {
      console.error('로그아웃 실패:', err);
      return next(err);
    }

    res.clearCookie('connect.sid');
    res.status(200).json({ message: '로그아웃 성공' });
  });
};

/**
 * [GET] /me
 * - 세션에 저장된 사용자 정보를 반환
 * - 로그인되어 있지 않으면 인증 오류 응답 (401 Unauthorized)
 */export const getMyInfo = (req, res, next) => {
  if (!req.session.user) {
    const err = new AppError('로그인이 필요합니다.', 401);
    return next(err);
  }

  res.status(200).json({
    message: '로그인된 사용자 정보',
    user: req.session.user,
  });
};