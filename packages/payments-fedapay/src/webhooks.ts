/**
 * FedaPay webhook/callback normalization.
 *
 * FedaPay calls the configured callback_url when a transaction status changes.
 * The handler should verify the transaction server-side before trusting it.
 */
import { BadRequestError } from '@rk-kit/errors'

export interface FedaPayWebhookPayload {
  id: number
  reference: string
  status: string
  amount: number
  currency: string
}

export interface FedaPayWebhookEvent {
  provider: 'fedapay'
  transactionId: number
  reference: string
  status: string
  amount: number
  currency: string
}

export function parseFedaPayWebhook(payload: unknown): FedaPayWebhookPayload {
  if (!payload || typeof payload !== 'object') {
    throw new BadRequestError('FedaPay webhook payload must be an object')
  }

  const data = payload as Record<string, unknown>
  const id = data.id ?? data.transaction_id
  if (typeof id !== 'number') {
    throw new BadRequestError('FedaPay webhook is missing a numeric transaction id')
  }

  const reference = (data.reference as string) || String(id)
  const status = (data.status as string) || 'unknown'
  const amount = data.amount ? Number(data.amount) : 0
  const currency = (data.currency as string) || 'XOF'

  return { id, reference, status, amount, currency }
}

export function normalizeFedaPayWebhook(
  payload: FedaPayWebhookPayload,
): FedaPayWebhookEvent {
  return {
    provider: 'fedapay',
    transactionId: payload.id,
    reference: payload.reference,
    status: payload.status,
    amount: payload.amount,
    currency: payload.currency,
  }
}
