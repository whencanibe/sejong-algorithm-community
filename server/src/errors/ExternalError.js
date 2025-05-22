export class ExternalError extends Error {
  constructor(message, retryAfterSec = null) {
    super(message);
    this.retryAfter = retryAfterSec;
    this.isOperational = true;
  }
}