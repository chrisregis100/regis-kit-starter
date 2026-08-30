import { isFedaPayConfigured } from "@rk-kit/billing";
import { serverEnv } from "@rk-kit/config";
import { jsonError, jsonOk } from "../../../../api/middleware/json-response";
import { handleFedaPayWebhook } from "../../../../services/billing-service";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  if (!isFedaPayConfigured(serverEnv)) {
    return jsonOk({ received: false, reason: "fedapay-not-configured" });
  }

  try {
    await handleFedaPayWebhook(await request.json());
    return jsonOk({ received: true });
  } catch (error) {
    return jsonError(error);
  }
}
