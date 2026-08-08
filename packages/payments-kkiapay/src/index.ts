/**
 * @rk-kit/payments-kkiapay — KKiapay payment adapter.
 *
 * Server-only. The client-side widget is loaded via the KKiapay JS SDK; the
 * public key is provided by the server through the billing status endpoint.
 */
export {
  getKkiapayBaseUrl,
  requireKkiapayKeys,
} from './client.js'
export {
  parseKkiapayWebhook,
  type KkiapayWebhookEvent,
  type KkiapayWebhookPayload,
} from './webhooks.js'
export {
  verifyKkiapayTransaction,
  type KkiapayTransaction,
  type KkiapayVerifyInput,
  type KkiapayVerifyResult,
} from './verify.js'
