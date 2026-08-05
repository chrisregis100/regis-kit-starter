/**
 * KKiapay webhook/callback normalization.
 *
 * KKiapay sends the transaction reference to the configured callback URL. The
 * handler should verify the transaction server-side before trusting the data.
 */
import { BadRequestError } from '@rk-kit/errors'
import type { KkiapayTransaction } from './verify.js'

export interface KkiapayWebhookPayload {
  transactionId: string
  data?:
    | {
        organizationId?: string
        paymentId?: string
        subscriptionId?: string
      }
    | string
    | undefined
}

export interface KkiapayWebhookEvent {
  provider: 'kkiapay'
  transactionId: string
  transaction: KkiapayTransaction
  isSuccess: boolean
}

export function parseKkiapayWebhook(
  payload: unknown,
): KkiapayWebhookPayload {
  if (!payload || typeof payload !== 'object') {
    throw new BadRequestError('KKiapay webhook payload must be an object')
  }

  const data = payload as Record<string, unknown>
  const transactionId =
    (data.transactionId as string) || (data.transaction_id as string)
  if (!transactionId) {
    throw new BadRequestError('KKiapay webhook is missing transactionId')
  }

  return { transactionId }
}
