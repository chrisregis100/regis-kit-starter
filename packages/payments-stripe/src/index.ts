/**
 * @rk-kit/payments-stripe — Stripe payment adapter.
 *
 * Server-only. All functions accept the validated `ServerEnv` so the caller
 * decides when to use the provider. The module is a no-op at import time when
 * Stripe is not configured.
 */
export {
  createStripeCheckoutSession,
  getPriceIdForPlan,
  type CreateStripeCheckoutInput,
  type StripeCheckoutResult,
} from './checkout.js'
export {
  createStripeCustomerPortalSession,
  findCustomerByEmail,
  type CreateStripePortalInput,
  type StripePortalResult,
} from './portal.js'
export {
  type StripeWebhookEvent,
  type StripeWebhookEventType,
  verifyStripeWebhook,
} from './webhooks.js'
