/**
 * Shared payment provider types and identifiers.
 *
 * These constants are used by the dashboard to render available payment
 * options and by the billing service to route provider-specific actions.
 */

export const PaymentProvider = {
  STRIPE: 'stripe',
  KKIAPAY: 'kkiapay',
  FEDAPAY: 'fedapay',
} as const

export type PaymentProvider =
  (typeof PaymentProvider)[keyof typeof PaymentProvider]

export interface AvailableProvider {
  id: PaymentProvider
  name: string
  /** Human-readable description shown in the dashboard. */
  description: string
  /** Public configuration the client needs to render the payment UI. */
  publicConfig?: Record<string, string | boolean | undefined>
}

export const Plan = {
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const

export type Plan = (typeof Plan)[keyof typeof Plan]

export const SubscriptionStatus = {
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  TRIALING: 'trialing',
  INACTIVE: 'inactive',
} as const

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]

export interface PlanDefinition {
  id: Plan
  name: string
  price: number
  currency: string
  period: 'month' | 'year' | 'one_time'
}

export const PLANS: Record<Plan, PlanDefinition> = {
  [Plan.STARTER]: {
    id: Plan.STARTER,
    name: 'Starter',
    price: 0,
    currency: 'USD',
    period: 'month',
  },
  [Plan.PRO]: {
    id: Plan.PRO,
    name: 'Pro',
    price: 29,
    currency: 'USD',
    period: 'month',
  },
  [Plan.ENTERPRISE]: {
    id: Plan.ENTERPRISE,
    name: 'Enterprise',
    price: 0,
    currency: 'USD',
    period: 'month',
  },
}
