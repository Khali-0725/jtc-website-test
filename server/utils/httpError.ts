/* ============================================================
   httpError.ts — typed application errors.
   Controllers/services throw AppError; the central error handler
   maps `statusCode` to the HTTP response and hides internals in prod.
   ============================================================ */

export class AppError extends Error {
  readonly statusCode: number;
  readonly expose: boolean;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    // 4xx messages are safe to expose to the client; 5xx are masked.
    this.expose = statusCode < 500;
    this.details = details;
    Error.captureStackTrace?.(this, AppError);
  }
}

export const badRequest = (msg = 'Bad request', details?: unknown) =>
  new AppError(400, msg, details);
export const unauthorized = (msg = 'Authentication required') => new AppError(401, msg);
export const forbidden = (msg = 'You do not have permission to do that') => new AppError(403, msg);
export const notFound = (msg = 'Resource not found') => new AppError(404, msg);
export const conflict = (msg = 'Resource already exists') => new AppError(409, msg);
export const tooMany = (msg = 'Too many requests') => new AppError(429, msg);
