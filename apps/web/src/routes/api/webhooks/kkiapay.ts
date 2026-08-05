/**
 * KKiapay webhook endpoint.
 *
 * KKiapay calls this URL after a payment attempt. The transaction id is
 * verified server-side against the KKiapay API before any subscription is
 * extended.
 */
import { createFileRoute } from "@tanstack/react-router";
import { isKkiapayConfigured } from "@rk-kit/billing";
import { serverEnv } from "@rk-kit/config";
import { jsonError, jsonOk } from "../../../api/middleware/json-response";
import type { KkiapayWebhookPayload } from "@rk-kit/payments-kkiapay";
import { handleKkiapayWebhook } from "../../../services/billing-service";

export const Route = createFileRoute("/api/webhooks/kkiapay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isKkiapayConfigured(serverEnv)) {
          return jsonOk({ received: false, reason: "kkiapay-not-configured" });
        }

        try {
          const body = (await request.json()) as KkiapayWebhookPayload;
          await handleKkiapayWebhook(body);
          return jsonOk({ received: true });
        } catch (error) {
          return jsonError(error);
        }
      },
    },
  },
});
