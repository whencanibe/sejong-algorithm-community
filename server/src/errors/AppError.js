/**
 * 애플리케이션에서 발생할 수 있는 예상 가능한 오류를 표현하는 커스텀 에러 클래스
 * - HTTP 상태 코드와 함께 메시지를 전달할 수 있으며,
 * - 시스템 오류와 구분하여 핸들링 가능하게 합니다.
 */
export class AppError extends Error {
  /**
   * @param {string} message - 에러 메시지
   * @param {number} status - HTTP 상태 코드 (기본값: 400)
   */
  constructor(message, status = 400) {
    super(message);
    this.status = status;
    this.isOperational = true;
  }
}