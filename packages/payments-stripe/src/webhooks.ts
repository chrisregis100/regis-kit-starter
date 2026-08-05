/**
 * Stripe webhook verification and event parsing.
 *
 * Returns a normalized payload so the app billing service can update the
 * database without importing the Stripe SDK in the route handler.
 */
import type { ServerEnv } from '@rk-kit/config'
import { BadRequestError, InternalError } from '@rk-kit/errors'
import { Plan, type SubscriptionStatus } from '@rk-kit/billing'
import type Stripe from 'stripe'
import { getStripeClient } from './client.js'

export interface StripeWebhookEvent {
  type: StripeWebhookEventType
  organizationId: string | null
  plan: Plan | null
  providerSubscriptionId: string | null
  providerCustomerId: string | null
  status: SubscriptionStatus | null
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  providerPaymentId: string | null
  amount: number | null
  currency: string | null
}


export type StripeWebhookEventType =
  | 'checkout.session.completed'
  | 'invoice.paid'
  | 'invoice.payment_failed'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'

export async function verifyStripeWebhook(
  payload: string,
  signature: string,
  env: ServerEnv,
): Promise<StripeWebhookEvent> {
  const secret = env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    throw new InternalError('STRIPE_WEBHOOK_SECRET is not configured')
  }

  const stripe = await getStripeClient(env)
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    throw new BadRequestError(`Stripe webhook verification failed: ${message}`)
  }

  return normalizeStripeEvent(event)
}

function normalizeStripeEvent(event: Stripe.Event): StripeWebhookEvent {
  const object = event.data.object as unknown as Record<string, unknown>

  const metadata = object.metadata as Record<string, string> | undefined
  const subscription = object as Record<string, unknown>

  const organizationId = metadata?.organizationId ?? null
  const plan = (metadata?.plan as Plan) ?? null
  const providerSubscriptionId =
    (object.id as string) || (subscription.subscription as string) || null
  const providerCustomerId =
    (object.customer as string) || (subscription.customer as string) || null

  const currentPeriodStart = subscription.current_period_start
    ? new Date((subscription.current_period_start as number) * 1000)
    : null
  const currentPeriodEnd = subscription.current_period_end
    ? new Date((subscription.current_period_end as number) * 1000)
    : null

  let status: SubscriptionStatus | null = null
  if (typeof subscription.status === 'string') {
    status = mapStripeStatus(subscription.status)
  }

  let amount: number | null = null
  let currency: string | null = null
  if (event.type === 'invoice.paid' || event.type === 'invoice.payment_failed') {
    const invoice = object as Record<string, unknown>
    amount = invoice.amount_paid ? (invoice.amount_paid as number) / 100 : null
    currency = (invoice.currency as string) ?? null
  }

  return {
    type: event.type as StripeWebhookEventType,
    organizationId,
    plan,
    providerSubscriptionId,
    providerCustomerId,
    status,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancel_at_period_end === true,
    providerPaymentId: (object.payment_intent as string) ?? null,
    amount,
    currency,
  }
}

function mapStripeStatus(stripeStatus: string): SubscriptionStatus {
  switch (stripeStatus) {
    case 'active':
      return 'active'
    case 'past_due':
      return 'past_due'
    case 'canceled':
    case 'cancelled':
      return 'cancelled'
    case 'trialing':
      return 'trialing'
    case 'incomplete':
    case 'incomplete_expired':
    case 'unpaid':
    default:
      return 'inactive'
  }
}
