import { describe, expect, it } from 'vitest'
import {
  extendPeriodEnd,
  getPlanPriceInXOF,
  isSubscriptionActive,
} from './subscription.js'
import { Plan, SubscriptionStatus } from './provider.js'

describe('isSubscriptionActive', () => {
  it('returns true for active status', () => {
    expect(
      isSubscriptionActive({
        status: SubscriptionStatus.ACTIVE,
        plan: Plan.PRO,
        currentPeriodEnd: null,
        provider: null,
      }),
    ).toBe(true)
  })

  it('returns false for inactive status', () => {
    expect(
      isSubscriptionActive({
        status: SubscriptionStatus.INACTIVE,
        plan: Plan.STARTER,
        currentPeriodEnd: null,
        provider: null,
      }),
    ).toBe(false)
  })
})

describe('extendPeriodEnd', () => {
  it('extends the given date by the requested days', () => {
    const from = new Date('2026-01-01T00:00:00.000Z')
    const next = extendPeriodEnd(30, from)
    expect(next.toISOString()).toBe('2026-01-31T23:59:59.999Z')
  })
})

describe('getPlanPriceInXOF', () => {
  it('returns a positive price for pro', () => {
    expect(getPlanPriceInXOF(Plan.PRO)).toBeGreaterThan(0)
  })

  it('returns zero for starter and enterprise', () => {
    expect(getPlanPriceInXOF(Plan.STARTER)).toBe(0)
    expect(getPlanPriceInXOF(Plan.ENTERPRISE)).toBe(0)
  })
})
