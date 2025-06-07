/**
* 외부 서비스(Solved.ac 등) 호출 중 발생한 예외를 나타내는 커스텀 에러 클래스
* - 재시도 대기 시간 정보를 포함할 수 있음
* - AppError와 마찬가지로 시스템 에러와 구분 가능
*/
export class ExternalError extends Error {
  /**
   * @param {string} message - 에러 메시지 (예: HTTP 상태, API 오류 설명 등)
   * @param {number|null} retryAfterSec - 재시도까지 대기해야 할 시간 (초 단위, 선택 사항)
   */
  constructor(message, retryAfterSec = null) {
    super(message);
    this.retryAfter = retryAfterSec;
    this.isOperational = true;
  }
}