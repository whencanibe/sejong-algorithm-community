/**
 * 로그인 여부를 확인하는 Express 미들웨어
 * - 세션(`req.session.user`)이 존재하면 요청을 다음 핸들러로 전달
 * - 인증이 필요한 라우트에 붙여서 보호
 */
export function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
      next();   // 로그인 상태 - 다음 미들웨어 또는 컨트롤러로 진행
    } else {
      res.status(401).json({ message: '로그인이 필요합니다.' });
    }
  }