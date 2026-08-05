/**
 * FedaPay webhook endpoint.
 *
 * FedaPay calls this URL when a transaction status changes. The transaction
 * is fetched server-side to verify its final status before extending the
 * subscription period.
 */
import { createFileRoute } from "@tanstack/react-router";
import { isFedaPayConfigured } from "@rk-kit/billing";
import { serverEnv } from "@rk-kit/config";
import { jsonError, jsonOk } from "../../../api/middleware/json-response";
import { handleFedaPayWebhook } from "../../../services/billing-service";

export const Route = createFileRoute("/api/webhooks/fedapay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isFedaPayConfigured(serverEnv)) {
          return jsonOk({ received: false, reason: "fedapay-not-configured" });
        }

        try {
          const body = await request.json();
          await handleFedaPayWebhook(body);
          return jsonOk({ received: true });
        } catch (error) {
          return jsonError(error);
        }
      },
    },
  },
});
