/**
 * KKiapay server-side HTTP client helpers.
 */
import type { ServerEnv } from '@rk-kit/config'
import { InternalError } from '@rk-kit/errors'

export function getKkiapayBaseUrl(env: ServerEnv): string {
  return env.KKIAPAY_SANDBOX === 'true'
    ? 'https://api-sandbox.kkiapay.me'
    : 'https://api.kkiapay.me'
}

export function requireKkiapayKeys(env: ServerEnv): {
  apiKey: string
  privateKey: string
  secretKey: string
} {
  const apiKey = env.KKIAPAY_PUBLIC_KEY
  const privateKey = env.KKIAPAY_PRIVATE_KEY
  const secretKey = env.KKIAPAY_SECRET_KEY

  if (!apiKey || !privateKey || !secretKey) {
    throw new InternalError('KKiapay is not fully configured')
  }

  return { apiKey, privateKey, secretKey }
}
