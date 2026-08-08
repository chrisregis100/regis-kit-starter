import { describe, expect, it } from 'vitest'
import { parseFedaPayWebhook } from './webhooks.js'
import { BadRequestError } from '@rk-kit/errors'

describe('parseFedaPayWebhook', () => {
  it('extracts transaction details from payload', () => {
    const payload = parseFedaPayWebhook({
      id: 123,
      reference: 'ref-123',
      status: 'approved',
      amount: 17500,
      currency: 'XOF',
    })
    expect(payload.id).toBe(123)
    expect(payload.reference).toBe('ref-123')
    expect(payload.status).toBe('approved')
    expect(payload.amount).toBe(17500)
    expect(payload.currency).toBe('XOF')
  })

  it('throws when id is missing', () => {
    expect(() => parseFedaPayWebhook({ status: 'approved' })).toThrow(BadRequestError)
  })
})
