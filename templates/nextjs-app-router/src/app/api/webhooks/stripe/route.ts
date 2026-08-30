import { isStripeConfigured } from "@rk-kit/billing";
import { serverEnv } from "@rk-kit/config";
import { jsonError, jsonOk } from "../../../../api/middleware/json-response";
import { handleStripeWebhook } from "../../../../services/billing-service";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  if (!isStripeConfigured(serverEnv)) {
    return jsonOk({ received: false, reason: "stripe-not-configured" });
  }

  try {
    const signature = request.headers.get("stripe-signature") ?? "";
    await handleStripeWebhook(await request.text(), signature);
    return jsonOk({ received: true });
  } catch (error) {
    return jsonError(error);
  }
}
