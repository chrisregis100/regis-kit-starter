/**
 * FedaPay server-side client helpers.
 */
import type { ServerEnv } from '@rk-kit/config'
import { InternalError } from '@rk-kit/errors'

export function getFedaPayBaseUrl(env: ServerEnv): string {
  return env.FEDAPAY_SANDBOX === 'true'
    ? 'https://sandbox-api.fedapay.com/v1'
    : 'https://api.fedapay.com/v1'
}

export function requireFedaPayKey(env: ServerEnv): string {
  const key = env.FEDAPAY_SECRET_KEY
  if (!key) {
    throw new InternalError('FedaPay is not configured')
  }
  return key
}
