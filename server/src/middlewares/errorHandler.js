import { AppError } from "../errors/AppError.js";
import { ExternalError } from "../errors/ExternalError.js";

export default function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof ExternalError) {
    console.warn('Solved.ac 문제:', err.message);
    return res.status(503).json({ error: 'Solved.ac 동기화 실패, 잠시 후 재시도' });
  }

  console.error(err);         // 시스템 오류
  res.status(500).json({ error: '서버 오류' });
}
