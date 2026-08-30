import { isKkiapayConfigured } from "@rk-kit/billing";
import { serverEnv } from "@rk-kit/config";
import type { KkiapayWebhookPayload } from "@rk-kit/payments-kkiapay";
import { jsonError, jsonOk } from "../../../../api/middleware/json-response";
import { handleKkiapayWebhook } from "../../../../services/billing-service";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  if (!isKkiapayConfigured(serverEnv)) {
    return jsonOk({ received: false, reason: "kkiapay-not-configured" });
  }

  try {
    const payload = (await request.json()) as KkiapayWebhookPayload;
    await handleKkiapayWebhook(payload);
    return jsonOk({ received: true });
  } catch (error) {
    return jsonError(error);
  }
}
