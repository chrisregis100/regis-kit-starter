/**
 * Stripe Customer Portal session creation.
 */
import type { ServerEnv } from '@rk-kit/config'
import { InternalError } from '@rk-kit/errors'
import { getStripeClient } from './client.js'

export interface CreateStripePortalInput {
  customerId: string
  returnUrl: string
}

export interface StripePortalResult {
  url: string
}

export async function createStripeCustomerPortalSession(
  input: CreateStripePortalInput,
  env: ServerEnv,
): Promise<StripePortalResult> {
  const stripe = await getStripeClient(env)

  const session = await stripe.billingPortal.sessions.create({
    customer: input.customerId,
    return_url: input.returnUrl,
  })

  if (!session.url) {
    throw new InternalError('Stripe Customer Portal session returned no URL')
  }

  return { url: session.url }
}

export async function findCustomerByEmail(
  email: string,
  env: ServerEnv,
): Promise<string | undefined> {
  const stripe = await getStripeClient(env)
  const customers = await stripe.customers.list({ email, limit: 1 })
  return customers.data[0]?.id
}
