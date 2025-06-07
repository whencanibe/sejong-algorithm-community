import { AppError } from "../errors/AppError.js";
import { ExternalError } from "../errors/ExternalError.js";

/**
 * Express 에러 핸들러 미들웨어
 * - AppError: 사용자 정의 에러 → 클라이언트에게 메시지 및 상태 코드 그대로 전달
 * - ExternalError: 외부 API (Solved.ac 등) 오류 → 503 응답
 * - 기타 예외: 시스템 에러로 간주하고 500 상태 코드와 함께 응답
 *
 * @param {Error} err - 전달된 에러 객체
 * @param {Request} _req - 요청 객체 (사용 안 함)
 * @param {Response} res - 응답 객체
 * @param {Function} _next - next 함수 (사용 안 함)
 */
export default function errorHandler(err, _req, res, _next) {
  // 사용자 정의 애플리케이션 에러
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }
  // 외부 API 오류 처리 (예: Solved.ac API 실패)
  if (err instanceof ExternalError) {
    console.warn('Solved.ac 문제:', err.message);
    return res.status(503).json({ error: 'Solved.ac 동기화 실패, 잠시 후 재시도' });
  }

  // 시스템 내부 오류 (알 수 없는 예외)
  console.error(err);        
  res.status(500).json({ error: err.message });
}
