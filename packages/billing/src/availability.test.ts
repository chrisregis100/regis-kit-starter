import { describe, expect, it } from 'vitest'
import { getAvailableProviders, isStripeConfigured } from './availability.js'
import type { ServerEnv } from '@rk-kit/config'

const baseEnv: ServerEnv = {
  DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
  BETTER_AUTH_SECRET: 'a'.repeat(32),
  BETTER_AUTH_URL: 'http://localhost:3000',
  NODE_ENV: 'development',
  PORT: 3000,
}

describe('getAvailableProviders', () => {
  it('returns no providers when none are configured', () => {
    const providers = getAvailableProviders(baseEnv)
    expect(providers).toHaveLength(0)
  })

  it('returns stripe when stripe keys are present', () => {
    const env: ServerEnv = {
      ...baseEnv,
      STRIPE_SECRET_KEY: 'sk_test_xxx',
      STRIPE_PUBLISHABLE_KEY: 'pk_test_xxx',
      STRIPE_PRICE_ID_PRO: 'price_xxx',
    }
    const providers = getAvailableProviders(env)
    expect(providers).toHaveLength(1)
    expect(providers[0]?.id).toBe('stripe')
  })

  it('isStripeConfigured requires secret, publishable key and pro price', () => {
    expect(isStripeConfigured(baseEnv)).toBe(false)
    expect(
      isStripeConfigured({
        ...baseEnv,
        STRIPE_SECRET_KEY: 'sk_test_xxx',
      }),
    ).toBe(false)
    expect(
      isStripeConfigured({
        ...baseEnv,
        STRIPE_SECRET_KEY: 'sk_test_xxx',
        STRIPE_PUBLISHABLE_KEY: 'pk_test_xxx',
        STRIPE_PRICE_ID_PRO: 'price_xxx',
      }),
    ).toBe(true)
  })
})
