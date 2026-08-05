/**
 * FedaPay transaction creation and retrieval.
 */
import type { ServerEnv } from '@rk-kit/config'
import { InternalError } from '@rk-kit/errors'
import { getFedaPayBaseUrl, requireFedaPayKey } from './client.js'

export interface FedaPayCreateTransactionInput {
  amount: number
  currency?: string
  description: string
  callbackUrl: string
  customerEmail?: string
  customerPhone?: string
  customerFirstName?: string
  customerLastName?: string
  metadata?: Record<string, unknown>
}

export interface FedaPayTransaction {
  id: number
  reference: string
  amount: number
  currency: string
  description: string
  status: 'pending' | 'approved' | 'canceled' | string
  callbackUrl: string
  createdAt: string
  updatedAt: string
  paymentUrl?: string
  metadata?: Record<string, unknown>
  custom_metadata?: Record<string, unknown>
}

export interface FedaPayCreateResult {
  transaction: FedaPayTransaction
  paymentUrl: string
}

export async function createFedaPayTransaction(
  input: FedaPayCreateTransactionInput,
  env: ServerEnv,
): Promise<FedaPayCreateResult> {
  const key = requireFedaPayKey(env)
  const baseUrl = getFedaPayBaseUrl(env)

  const body: Record<string, unknown> = {
    amount: input.amount,
    currency: { iso: input.currency ?? 'XOF' },
    description: input.description,
    callback_url: input.callbackUrl,
    custom_metadata: input.metadata,
  }

  if (input.customerEmail || input.customerPhone) {
    body.customer = {
      ...(input.customerEmail ? { email: input.customerEmail } : {}),
      ...(input.customerPhone ? { phone_number: input.customerPhone } : {}),
      ...(input.customerFirstName ? { firstname: input.customerFirstName } : {}),
      ...(input.customerLastName ? { lastname: input.customerLastName } : {}),
    }
  }

  const response = await fetch(`${baseUrl}/transactions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new InternalError(`FedaPay create transaction failed (${response.status}): ${text}`)
  }

  const data = (await response.json()) as { transaction: FedaPayTransaction }
  const transaction = data.transaction

  const paymentUrl = transaction.paymentUrl
  if (!paymentUrl) {
    throw new InternalError('FedaPay transaction did not return a payment URL')
  }

  return { transaction, paymentUrl }
}

export async function getFedaPayTransaction(
  transactionId: number,
  env: ServerEnv,
): Promise<FedaPayTransaction> {
  const key = requireFedaPayKey(env)
  const baseUrl = getFedaPayBaseUrl(env)

  const response = await fetch(`${baseUrl}/transactions/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new InternalError(`FedaPay get transaction failed (${response.status}): ${text}`)
  }

  const data = (await response.json()) as { transaction: FedaPayTransaction }
  return data.transaction
}
