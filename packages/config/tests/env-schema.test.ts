import { describe, expect, it } from 'vitest'
import { parseServerEnv } from '../src/env-schema'

const validEnv = {
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
  BETTER_AUTH_SECRET: 'a'.repeat(32),
  BETTER_AUTH_URL: 'http://localhost:3000',
}

describe('parseServerEnv', () => {
  it('accepts a valid environment and applies defaults', () => {
    const env = parseServerEnv(validEnv)

    expect(env.DATABASE_URL).toBe(validEnv.DATABASE_URL)
    expect(env.NODE_ENV).toBe('development')
    expect(env.PORT).toBe(3000)
  })

  it('coerces PORT from string', () => {
    const env = parseServerEnv({ ...validEnv, PORT: '8080' })
    expect(env.PORT).toBe(8080)
  })

  it('keeps optional Google credentials undefined when absent', () => {
    const env = parseServerEnv(validEnv)
    expect(env.GOOGLE_CLIENT_ID).toBeUndefined()
    expect(env.GOOGLE_CLIENT_SECRET).toBeUndefined()
  })

  it('throws when DATABASE_URL is missing, naming the field', () => {
    const { DATABASE_URL: _omitted, ...rest } = validEnv
    expect(() => parseServerEnv(rest)).toThrowError(/DATABASE_URL/)
  })

  it('throws when BETTER_AUTH_SECRET is too short', () => {
    expect(() =>
      parseServerEnv({ ...validEnv, BETTER_AUTH_SECRET: 'short' }),
    ).toThrowError(/BETTER_AUTH_SECRET/)
  })

  it('throws when BETTER_AUTH_URL is not a URL', () => {
    expect(() =>
      parseServerEnv({ ...validEnv, BETTER_AUTH_URL: 'not-a-url' }),
    ).toThrowError(/BETTER_AUTH_URL/)
  })

  it('rejects an invalid NODE_ENV', () => {
    expect(() =>
      parseServerEnv({ ...validEnv, NODE_ENV: 'staging' }),
    ).toThrowError(/NODE_ENV/)
  })

  it('lists every invalid field in one error message', () => {
    expect(() => parseServerEnv({})).toThrowError(
      /DATABASE_URL[\s\S]*BETTER_AUTH_SECRET[\s\S]*BETTER_AUTH_URL/,
    )
  })
})
