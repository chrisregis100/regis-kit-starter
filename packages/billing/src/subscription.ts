/**
 * Pure subscription lifecycle helpers.
 *
 * These functions operate on the subscription shape and do not touch the
 * database. They are used by the billing service to compute the next status,
 * extend a period after a one-time payment, or derive an active plan.
 */
import { Plan, SubscriptionStatus, type PlanDefinition, PLANS } from './provider.js'

export interface SubscriptionLike {
  plan: string
  status: string
  currentPeriodEnd: Date | string | null
  provider: string | null
}

export function getPlanDefinition(plan: string): PlanDefinition | undefined {
  return PLANS[plan as Plan]
}

export function isSubscriptionActive(subscription: SubscriptionLike): boolean {
  const status = subscription.status as SubscriptionStatus
  if (status === SubscriptionStatus.ACTIVE) return true
  if (status === SubscriptionStatus.TRIALING) return true
  if (status === SubscriptionStatus.PAST_DUE) {
    const periodEnd = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd)
      : null
    return periodEnd ? periodEnd > new Date() : false
  }
  return false
}

export function getSubscriptionDisplayStatus(
  subscription: SubscriptionLike,
): SubscriptionStatus {
  const periodEnd = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd)
    : null

  if (subscription.status === SubscriptionStatus.CANCELLED) {
    return periodEnd && periodEnd > new Date()
      ? SubscriptionStatus.ACTIVE
      : SubscriptionStatus.INACTIVE
  }

  return subscription.status as SubscriptionStatus
}

export function extendPeriodEnd(days: number, from = new Date()): Date {
  const next = new Date(from)
  next.setUTCDate(next.getUTCDate() + days)
  next.setUTCHours(23, 59, 59, 999)
  return next
}

export function getPlanPriceInXOF(plan: Plan): number {
  // Approximate conversion for West African mobile money providers.
  // Pro: 29 USD → ~17 500 XOF. Enterprise is custom.
  const xofRates: Record<Plan, number> = {
    [Plan.STARTER]: 0,
    [Plan.PRO]: 17500,
    [Plan.ENTERPRISE]: 0,
  }
  return xofRates[plan]
}
