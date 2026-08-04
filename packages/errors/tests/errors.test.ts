import { describe, expect, it } from 'vitest'
import {
  AppError,
  ConflictError,
  ErrorCode,
  ForbiddenError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  handleUnknownError,
  toAppError,
  toHttpResponse,
} from '../src/index'

describe('error hierarchy', () => {
  it('maps each error class to the right code and status', () => {
    const cases: Array<[AppError, string, number]> = [
      [new ValidationError('bad input'), ErrorCode.VALIDATION, 400],
      [new UnauthorizedError(), ErrorCode.UNAUTHORIZED, 401],
      [new ForbiddenError(), ErrorCode.FORBIDDEN, 403],
      [new NotFoundError('Project'), ErrorCode.NOT_FOUND, 404],
      [new ConflictError('duplicate slug'), ErrorCode.CONFLICT, 409],
      [new InternalError(), ErrorCode.INTERNAL, 500],
    ]

    for (const [error, code, status] of cases) {
      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe(code)
      expect(error.statusCode).toBe(status)
    }
  })

  it('NotFoundError embeds the resource name', () => {
    expect(new NotFoundError('Project').message).toBe('Project not found')
  })

  it('preserves instanceof across the hierarchy', () => {
    const error = new ValidationError('nope')
    expect(error instanceof ValidationError).toBe(true)
    expect(error instanceof AppError).toBe(true)
    expect(error instanceof Error).toBe(true)
  })
})

describe('toHttpResponse', () => {
  it('serializes a domain error with its public message', () => {
    const { status, body } = toHttpResponse(new ForbiddenError('No access'))
    expect(status).toBe(403)
    expect(body.error.code).toBe(ErrorCode.FORBIDDEN)
    expect(body.error.message).toBe('No access')
  })

  it('sanitizes InternalError messages (no internal leak)', () => {
    const { status, body } = toHttpResponse(
      new InternalError('pg: connection refused at 10.0.0.5'),
    )
    expect(status).toBe(500)
    expect(body.error.message).toBe('An unexpected error occurred')
    expect(JSON.stringify(body)).not.toContain('10.0.0.5')
  })

  it('includes field details for validation errors', () => {
    const { body } = toHttpResponse(
      new ValidationError('invalid', { name: ['Name is required'] }),
    )
    expect(body.error.fields).toEqual({ name: ['Name is required'] })
  })

  it('omits fields when the validation error has none', () => {
    const { body } = toHttpResponse(new ValidationError('invalid'))
    expect(body.error.fields).toBeUndefined()
  })
})

describe('toAppError', () => {
  it('passes AppError through untouched', () => {
    const original = new NotFoundError('User')
    expect(toAppError(original)).toBe(original)
  })

  it('wraps a plain Error into InternalError with cause', () => {
    const original = new Error('boom')
    const wrapped = toAppError(original)
    expect(wrapped).toBeInstanceOf(InternalError)
    expect(wrapped.cause).toBe(original)
  })

  it('wraps non-Error values', () => {
    const wrapped = toAppError('a string was thrown')
    expect(wrapped).toBeInstanceOf(InternalError)
  })
})

describe('handleUnknownError', () => {
  it('coerces and serializes in one call, sanitized', () => {
    const { status, body } = handleUnknownError(new Error('secret detail'))
    expect(status).toBe(500)
    expect(body.error.message).toBe('An unexpected error occurred')
  })
})
