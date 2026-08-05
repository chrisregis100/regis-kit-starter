import { describe, expect, it } from 'vitest'
import { parseKkiapayWebhook } from './webhooks.js'
import { BadRequestError } from '@rk-kit/errors'

describe('parseKkiapayWebhook', () => {
  it('extracts transactionId from payload', () => {
    const payload = parseKkiapayWebhook({ transactionId: 'tx-123' })
    expect(payload.transactionId).toBe('tx-123')
  })

  it('throws when transactionId is missing', () => {
    expect(() => parseKkiapayWebhook({})).toThrow(BadRequestError)
  })
})
