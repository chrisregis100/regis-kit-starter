/**
 * Stripe server-side client.
 *
 * The Stripe SDK is lazy-loaded and instantiated only when the provider is
 * configured. This keeps the module safe to import even when Stripe is disabled.
 */
import type { ServerEnv } from '@rk-kit/config'
import { InternalError } from '@rk-kit/errors'
import type Stripe from 'stripe'

let cachedStripe: Stripe | undefined

export async function getStripeClient(env: ServerEnv): Promise<Stripe> {
  const secretKey = env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new InternalError('Stripe is not configured')
  }

  if (!cachedStripe) {
    const { default: StripeConstructor } = await import('stripe')
    cachedStripe = new StripeConstructor(secretKey, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  }

  return cachedStripe
}
