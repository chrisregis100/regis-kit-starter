/**
 * Stripe webhook endpoint.
 *
 * Stripe sends signed event payloads to this route. The body is read raw so
 * the signature verification can run before JSON parsing.
 */
import { createFileRoute } from "@tanstack/react-router";
import { isStripeConfigured } from "@rk-kit/billing";
import { serverEnv } from "@rk-kit/config";
import { jsonError, jsonOk } from "../../../api/middleware/json-response";
import { handleStripeWebhook } from "../../../services/billing-service";

export const Route = createFileRoute("/api/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isStripeConfigured(serverEnv)) {
          return jsonOk({ received: false, reason: "stripe-not-configured" });
        }

        const signature = request.headers.get("stripe-signature") ?? "";
        const payload = await request.text();

        try {
          await handleStripeWebhook(payload, signature);
          return jsonOk({ received: true });
        } catch (error) {
          return jsonError(error);
        }
      },
    },
  },
});
