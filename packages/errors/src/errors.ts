/**
 * Typed error hierarchy for the application.
 *
 * All errors extend AppError which carries:
 * - `code`       — machine-readable error code (e.g. "NOT_FOUND")
 * - `statusCode` — HTTP status to send in responses
 * - `message`    — public-safe message (never leak internal details)
 * - `cause`      — optional original error (NOT serialized to HTTP responses)
 */

/** Machine-readable application error codes. */
export const ErrorCode = {
  VALIDATION: 'VALIDATION',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL: 'INTERNAL',
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

/** Base application error. All domain errors extend this. */
export class AppError extends Error {
  readonly code: ErrorCode
  readonly statusCode: number

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    options?: { cause?: unknown },
  ) {
    super(message, options)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Input failed Zod or custom validation (400). */
export class ValidationError extends AppError {
  readonly fields: Record<string, string[]>

  constructor(
    message: string,
    fields: Record<string, string[]> = {},
    options?: { cause?: unknown },
  ) {
    super(message, ErrorCode.VALIDATION, 400, options)
    this.name = 'ValidationError'
    this.fields = fields
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Request is malformed but not a schema issue (400). */
export class BadRequestError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, ErrorCode.BAD_REQUEST, 400, options)
    this.name = 'BadRequestError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Missing or expired authentication token (401). */
export class UnauthorizedError extends AppError {
  constructor(
    message = 'Authentication required',
    options?: { cause?: unknown },
  ) {
    super(message, ErrorCode.UNAUTHORIZED, 401, options)
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Alias for UnauthorizedError (semantic clarity). */
export const AuthError = UnauthorizedError

/** Authenticated but lacks permission (403). */
export class ForbiddenError extends AppError {
  constructor(message = 'Access denied', options?: { cause?: unknown }) {
    super(message, ErrorCode.FORBIDDEN, 403, options)
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Requested resource does not exist (404). */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', options?: { cause?: unknown }) {
    super(`${resource} not found`, ErrorCode.NOT_FOUND, 404, options)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Unique constraint violation or duplicate resource (409). */
export class ConflictError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, ErrorCode.CONFLICT, 409, options)
    this.name = 'ConflictError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Unexpected server-side error — never expose internals (500). */
export class InternalError extends AppError {
  constructor(
    message = 'An unexpected error occurred',
    options?: { cause?: unknown },
  ) {
    super(message, ErrorCode.INTERNAL, 500, options)
    this.name = 'InternalError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
