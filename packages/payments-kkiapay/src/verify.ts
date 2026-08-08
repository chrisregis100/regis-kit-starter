/**
 * KKiapay transaction verification.
 *
 * After the client widget completes a payment, the server must verify the
 * transaction status using the private and secret keys.
 */
import type { ServerEnv } from '@rk-kit/config'
import { InternalError } from '@rk-kit/errors'
import { getKkiapayBaseUrl, requireKkiapayKeys } from './client.js'

export interface KkiapayVerifyInput {
  transactionId: string
}

export interface KkiapayTransaction {
  transactionId: string
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | string
  amount: number
  currency: string
  phone?: string | undefined
  performedAt?: string | undefined
  reason?: string | undefined
  failureCode?: string | undefined
  failureMessage?: string | undefined
}

export interface KkiapayVerifyResult {
  transaction: KkiapayTransaction
  isSuccess: boolean
}

export async function verifyKkiapayTransaction(
  input: KkiapayVerifyInput,
  env: ServerEnv,
): Promise<KkiapayVerifyResult> {
  const { apiKey, privateKey, secretKey } = requireKkiapayKeys(env)

  const baseUrl = getKkiapayBaseUrl(env)
  const response = await fetch(`${baseUrl}/api/v1/transactions/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
      'X-PRIVATE-KEY': privateKey,
      'X-SECRET-KEY': secretKey,
    },
    body: JSON.stringify({ transactionId: input.transactionId }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new InternalError(
      `KKiapay verification failed (${response.status}): ${body}`,
    )
  }

  const data = (await response.json()) as Record<string, unknown>
  const transaction = normalizeKkiapayTransaction(data, input.transactionId)

  return {
    transaction,
    isSuccess: transaction.status === 'SUCCESS',
  }
}

function normalizeKkiapayTransaction(
  data: Record<string, unknown>,
  transactionId: string,
): KkiapayTransaction {
  const status = (data.status as string) || 'UNKNOWN'
  const amount = data.amount ? Number(data.amount) : 0

  return {
    transactionId: (data.transactionId as string) || transactionId,
    status,
    amount,
    currency: 'XOF',
    phone: data.phone as string | undefined,
    performedAt: data.performedAt as string | undefined,
    reason: data.reason as string | undefined,
    failureCode: data.failureCode as string | undefined,
    failureMessage: data.failureMessage as string | undefined,
  }
}
