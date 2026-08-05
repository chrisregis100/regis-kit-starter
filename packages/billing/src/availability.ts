/**
 * Detect which payment providers are configured at runtime.
 *
 * All provider keys are optional in the environment schema. A provider is
 * considered available only when the minimum required keys for that provider
 * are present. This lets the app boot with zero, one, or many providers.
 */
import type { ServerEnv } from '@rk-kit/config'
import {
  AvailableProvider,
  PaymentProvider,
} from './provider.js'

export function getAvailableProviders(env: ServerEnv): AvailableProvider[] {
  const providers: AvailableProvider[] = []

  if (isStripeConfigured(env)) {
    providers.push({
      id: PaymentProvider.STRIPE,
      name: 'Stripe',
      description: 'Credit card, SEPA and other international payment methods.',
      publicConfig: {
        publishableKey: env.STRIPE_PUBLISHABLE_KEY,
      },
    })
  }

  if (isKkiapayConfigured(env)) {
    providers.push({
      id: PaymentProvider.KKIAPAY,
      name: 'KKiapay',
      description: 'Mobile money, card and Wave payments in West Africa.',
      publicConfig: {
        publicKey: env.KKIAPAY_PUBLIC_KEY,
        sandbox: env.KKIAPAY_SANDBOX === 'true',
      },
    })
  }

  if (isFedaPayConfigured(env)) {
    providers.push({
      id: PaymentProvider.FEDAPAY,
      name: 'FedaPay',
      description: 'Mobile money and card payments in West Africa.',
      publicConfig: {
        sandbox: env.FEDAPAY_SANDBOX === 'true',
      },
    })
  }

  return providers
}

export function isStripeConfigured(env: ServerEnv): boolean {
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY && env.STRIPE_PRICE_ID_PRO)
}

export function isKkiapayConfigured(env: ServerEnv): boolean {
  return Boolean(
    env.KKIAPAY_PUBLIC_KEY && env.KKIAPAY_PRIVATE_KEY && env.KKIAPAY_SECRET_KEY,
  )
}

export function isFedaPayConfigured(env: ServerEnv): boolean {
  return Boolean(env.FEDAPAY_SECRET_KEY)
}

export function isAnyProviderConfigured(env: ServerEnv): boolean {
  return (
    isStripeConfigured(env) ||
    isKkiapayConfigured(env) ||
    isFedaPayConfigured(env)
  )
}
