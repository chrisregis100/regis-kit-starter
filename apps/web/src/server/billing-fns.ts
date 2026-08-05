/**
 * Billing server functions — the front boundary for TanStack Start.
 *
 * Each function validates input, resolves the tenant from the session, then
 * delegates to the billing service.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireOrganization } from "@rk-kit/auth";
import { Plan } from "@rk-kit/billing";
import {
  createFedaPayPayment,
  createKkiapayPayment,
  createStripeCheckout,
  createStripePortal,
  getBillingStatus,
  verifyKkiapayPayment,
  type CreateFedaPayPaymentInput,
  type CreateStripeCheckoutInput,
} from "../services/billing-service";

const planSchema = z.object({
  plan: z.enum([Plan.PRO, Plan.ENTERPRISE]),
});

const redirectUrlSchema = z.object({
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

const checkoutSchema = planSchema.merge(redirectUrlSchema);
const fedapaySchema = planSchema.merge(redirectUrlSchema);
const returnUrlSchema = z.object({ returnUrl: z.string().url() });
const kkiapayWebhookSchema = z.object({
  paymentId: z.string().uuid(),
  transactionId: z.string().min(1),
});

export const getBillingStatusFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    return getBillingStatus(organizationId);
  },
);

export const createStripeCheckoutFn = createServerFn({ method: "POST" })
  .validator(checkoutSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    return createStripeCheckout(
      organizationId,
      ctx.data as CreateStripeCheckoutInput,
    );
  });

export const createStripePortalFn = createServerFn({ method: "POST" })
  .validator(returnUrlSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    return createStripePortal(organizationId, ctx.data.returnUrl);
  });

export const createKkiapayPaymentFn = createServerFn({ method: "POST" })
  .validator(planSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    return createKkiapayPayment(organizationId, ctx.data.plan);
  });

export const createFedaPayPaymentFn = createServerFn({ method: "POST" })
  .validator(fedapaySchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    return createFedaPayPayment(
      organizationId,
      ctx.data as CreateFedaPayPaymentInput,
    );
  });

export const verifyKkiapayTransactionFn = createServerFn({ method: "POST" })
  .validator(kkiapayWebhookSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    await verifyKkiapayPayment(
      organizationId,
      ctx.data.transactionId,
      ctx.data.paymentId,
    );
    return { success: true };
  });
