/**
 * @rk-kit/billing — billing core (provider detection, subscription helpers, plans).
 *
 * This package contains no provider-specific API code and no database queries.
 * It is safe to import from any server-side code.
 */
export {
  getAvailableProviders,
  isAnyProviderConfigured,
  isFedaPayConfigured,
  isKkiapayConfigured,
  isStripeConfigured,
} from './availability.js'
export type { AvailableProvider } from './provider.js'
export {
  PaymentProvider,
  Plan,
  PLANS,
  SubscriptionStatus,
} from './provider.js'
export type { PlanDefinition } from './provider.js'
export {
  extendPeriodEnd,
  getPlanDefinition,
  getPlanPriceInXOF,
  getSubscriptionDisplayStatus,
  isSubscriptionActive,
} from './subscription.js'
