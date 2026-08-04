import {
  AppError,
  ErrorCode,
  InternalError,
  ValidationError,
} from './errors.js'

/** Shape returned to HTTP clients. */
export interface HttpErrorResponse {
  error: {
    code: string
    message: string
    /** Only present for validation errors. */
    fields?: Record<string, string[]>
  }
}

/**
 * Serialize any AppError into an HTTP response body.
 *
 * InternalError messages are sanitized — only the generic phrase
 * is forwarded to the client; the real cause stays server-side.
 */
export function toHttpResponse(error: AppError): {
  status: number
  body: HttpErrorResponse
} {
  const isInternal = error.code === ErrorCode.INTERNAL

  const body: HttpErrorResponse = {
    error: {
      code: error.code,
      message: isInternal ? 'An unexpected error occurred' : error.message,
      ...(error instanceof ValidationError &&
      Object.keys(error.fields).length > 0
        ? { fields: error.fields }
        : {}),
    },
  }

  return { status: error.statusCode, body }
}

/**
 * Coerce any unknown thrown value into an AppError.
 *
 * @example
 * ```ts
 * try {
 *   await doSomething()
 * } catch (err) {
 *   const appErr = toAppError(err)
 *   const { status, body } = toHttpResponse(appErr)
 *   return Response.json(body, { status })
 * }
 * ```
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error

  if (error instanceof Error) {
    return new InternalError(error.message, { cause: error })
  }

  return new InternalError('An unknown error occurred', { cause: error })
}

/** Coerce + serialize in one call. */
export function handleUnknownError(error: unknown): {
  status: number
  body: HttpErrorResponse
} {
  return toHttpResponse(toAppError(error))
}
