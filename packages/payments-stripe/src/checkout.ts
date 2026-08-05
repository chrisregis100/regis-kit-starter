/**
 * Stripe Checkout session creation for subscriptions.
 */
import type { ServerEnv } from '@rk-kit/config'
import { BadRequestError, InternalError } from '@rk-kit/errors'
import { Plan } from '@rk-kit/billing'
import { getStripeClient } from './client.js'

export interface CreateStripeCheckoutInput {
  organizationId: string
  organizationName: string
  plan: Plan
  successUrl: string
  cancelUrl: string
  customerEmail?: string | undefined
}

export interface StripeCheckoutResult {
  sessionId: string
  url: string
}

export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutInput,
  env: ServerEnv,
): Promise<StripeCheckoutResult> {
  const stripe = await getStripeClient(env)
  const priceId = getPriceIdForPlan(input.plan, env)
  if (!priceId) {
    throw new BadRequestError(`Stripe price is not configured for plan ${input.plan}`)
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: input.customerEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      organizationId: input.organizationId,
      plan: input.plan,
    },
    subscription_data: {
      metadata: {
        organizationId: input.organizationId,
        plan: input.plan,
      },
    },
  } as Parameters<typeof stripe.checkout.sessions.create>[0])

  if (!session.url) {
    throw new InternalError('Stripe Checkout session returned no redirect URL')
  }

  return { sessionId: session.id, url: session.url }
}

export function getPriceIdForPlan(plan: Plan, env: ServerEnv): string | undefined {
  if (plan === Plan.PRO) return env.STRIPE_PRICE_ID_PRO
  if (plan === Plan.ENTERPRISE) return env.STRIPE_PRICE_ID_ENTERPRISE
  return undefined
}
