import { describe, expect, it } from 'vitest'
import { getPriceIdForPlan } from './checkout.js'
import { Plan } from '@rk-kit/billing'
import type { ServerEnv } from '@rk-kit/config'

const env: ServerEnv = {
  DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
  BETTER_AUTH_SECRET: 'a'.repeat(32),
  BETTER_AUTH_URL: 'http://localhost:3000',
  NODE_ENV: 'development',
  PORT: 3000,
  STRIPE_SECRET_KEY: 'sk_test_xxx',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_xxx',
  STRIPE_PRICE_ID_PRO: 'price_pro',
  STRIPE_PRICE_ID_ENTERPRISE: 'price_enterprise',
}

describe('getPriceIdForPlan', () => {
  it('returns the configured price id for pro', () => {
    expect(getPriceIdForPlan(Plan.PRO, env)).toBe('price_pro')
  })

  it('returns the configured price id for enterprise', () => {
    expect(getPriceIdForPlan(Plan.ENTERPRISE, env)).toBe('price_enterprise')
  })

  it('returns undefined for starter', () => {
    expect(getPriceIdForPlan(Plan.STARTER, env)).toBeUndefined()
  })
})
