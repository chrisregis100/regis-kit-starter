/**
 * @rk-kit/payments-fedapay — FedaPay payment adapter.
 *
 * Server-only. Creates FedaPay transactions and normalizes webhook events.
 */
export {
  getFedaPayBaseUrl,
  requireFedaPayKey,
} from './client.js'
export {
  createFedaPayTransaction,
  getFedaPayTransaction,
  type FedaPayCreateResult,
  type FedaPayCreateTransactionInput,
  type FedaPayTransaction,
} from './transactions.js'
export {
  normalizeFedaPayWebhook,
  parseFedaPayWebhook,
  type FedaPayWebhookEvent,
  type FedaPayWebhookPayload,
} from './webhooks.js'
