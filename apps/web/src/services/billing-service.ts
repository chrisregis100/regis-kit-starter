/**
 * Billing service — business logic for subscriptions and payments.
 *
 * All database access goes through `withTenant()` so RLS policies are enforced.
 * Provider-specific HTTP calls are delegated to the payment adapter packages.
 */
import { z } from "zod";
import {
  extendPeriodEnd,
  getAvailableProviders,
  getPlanPriceInXOF,
  isAnyProviderConfigured,
  PaymentProvider,
  Plan,
  type AvailableProvider,
  type SubscriptionStatus,
} from "@rk-kit/billing";
import { serverEnv } from "@rk-kit/config";
import {
  createFedaPayTransaction,
  getFedaPayTransaction,
  normalizeFedaPayWebhook,
  parseFedaPayWebhook,
} from "@rk-kit/payments-fedapay";
import {
  parseKkiapayWebhook,
  verifyKkiapayTransaction,
  type KkiapayWebhookPayload,
} from "@rk-kit/payments-kkiapay";
import {
  createStripeCheckoutSession,
  createStripeCustomerPortalSession,
  verifyStripeWebhook,
} from "@rk-kit/payments-stripe";
import {
  and,
  eq,
  payment,
  subscription,
  type NewPayment,
  type NewSubscription,
  type Subscription,
  type TenantTx,
  withTenant,
} from "@rk-kit/db";
import { BadRequestError, InternalError, NotFoundError } from "@rk-kit/errors";

export const createStripeCheckoutSchema = z.object({
  plan: z.enum([Plan.PRO, Plan.ENTERPRISE]),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export type CreateStripeCheckoutInput = z.infer<typeof createStripeCheckoutSchema>;

export const createFedaPayPaymentSchema = z.object({
  plan: z.enum([Plan.PRO, Plan.ENTERPRISE]),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export type CreateFedaPayPaymentInput = z.infer<typeof createFedaPayPaymentSchema>;

export interface BillingStatus {
  subscription: Subscription | null;
  providers: AvailableProvider[];
  hasAnyProvider: boolean;
}

export interface CheckoutRedirect {
  url: string;
}

export type TenantRunner = <T>(
  organizationId: string,
  fn: (tx: TenantTx) => Promise<T>,
) => Promise<T>;

export async function getBillingStatus(
  organizationId: string,
  runInTenant: TenantRunner = withTenant,
): Promise<BillingStatus> {
  const providers = getAvailableProviders(serverEnv);
  const sub = await getOrCreateSubscription(organizationId, runInTenant);

  return {
    subscription: sub,
    providers,
    hasAnyProvider: isAnyProviderConfigured(serverEnv),
  };
}

export async function createStripeCheckout(
  organizationId: string,
  input: CreateStripeCheckoutInput,
  runInTenant: TenantRunner = withTenant,
): Promise<CheckoutRedirect> {
  const parsed = createStripeCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    throw new BadRequestError(
      parsed.error.issues.map((i) => i.message).join(", "),
    );
  }

  await getOrCreateSubscription(organizationId, runInTenant);
  const result = await createStripeCheckoutSession(
    {
      organizationId,
      organizationName: organizationId,
      plan: parsed.data.plan,
      successUrl: parsed.data.successUrl,
      cancelUrl: parsed.data.cancelUrl,
    },
    serverEnv,
  );

  return { url: result.url };
}

export async function createStripePortal(
  organizationId: string,
  returnUrl: string,
  runInTenant: TenantRunner = withTenant,
): Promise<CheckoutRedirect> {
  const sub = await getOrCreateSubscription(organizationId, runInTenant);
  if (!sub.providerSubscriptionId) {
    throw new BadRequestError("No active Stripe subscription to manage");
  }

  const customerId = sub.providerCustomerId;
  if (!customerId) {
    throw new NotFoundError("Stripe customer");
  }

  const result = await createStripeCustomerPortalSession(
    { customerId, returnUrl },
    serverEnv,
  );
  return { url: result.url };
}

export async function createKkiapayPayment(
  organizationId: string,
  plan: Plan,
  runInTenant: TenantRunner = withTenant,
): Promise<{
  amount: number;
  currency: string;
  organizationId: string;
  paymentId: string;
}> {
  const amount = getPlanPriceInXOF(plan);
  if (amount <= 0) {
    throw new BadRequestError("Selected plan cannot be paid via KKiapay");
  }

  const sub = await getOrCreateSubscription(organizationId, runInTenant);
  const paymentId = crypto.randomUUID();
  await runInTenant(organizationId, async (tx) => {
    await tx.insert(payment).values({
      id: paymentId,
      organizationId,
      subscriptionId: sub.id,
      provider: PaymentProvider.KKIAPAY,
      amount: String(amount),
      currency: "XOF",
      status: "pending",
      metadata: { plan },
    });
  });

  return { amount, currency: "XOF", organizationId, paymentId };
}

export async function createFedaPayPayment(
  organizationId: string,
  input: CreateFedaPayPaymentInput,
  runInTenant: TenantRunner = withTenant,
): Promise<CheckoutRedirect> {
  const parsed = createFedaPayPaymentSchema.safeParse(input);
  if (!parsed.success) {
    throw new BadRequestError(
      parsed.error.issues.map((i) => i.message).join(", "),
    );
  }

  const plan = parsed.data.plan;
  const amount = getPlanPriceInXOF(plan);
  if (amount <= 0) {
    throw new BadRequestError("Selected plan cannot be paid via FedaPay");
  }

  const sub = await getOrCreateSubscription(organizationId, runInTenant);
  const result = await createFedaPayTransaction(
    {
      amount,
      description: `RK Kit ${plan} plan — monthly subscription`,
      callbackUrl: parsed.data.successUrl,
      metadata: {
        organizationId,
        plan,
        subscriptionId: sub.id,
      },
    },
    serverEnv,
  );

  await runInTenant(organizationId, async (tx) => {
    await tx.insert(payment).values({
      id: crypto.randomUUID(),
      organizationId,
      subscriptionId: sub.id,
      provider: PaymentProvider.FEDAPAY,
      providerPaymentId: String(result.transaction.id),
      amount: String(amount),
      currency: "XOF",
      status: "pending",
      metadata: {
        reference: result.transaction.reference,
        paymentUrl: result.paymentUrl,
      },
    });
  });

  return { url: result.paymentUrl };
}

export async function handleStripeWebhook(
  payload: string,
  signature: string,
): Promise<void> {
  const event = await verifyStripeWebhook(payload, signature, serverEnv);

  const organizationId = event.organizationId;
  if (!organizationId) {
    console.warn("[billing] Stripe webhook missing organizationId metadata");
    return;
  }

  await withTenant(organizationId, async (tx) => {
    const existing = await tx
      .select()
      .from(subscription)
      .where(eq(subscription.organizationId, organizationId))
      .limit(1);

    const sub = existing[0] ?? (await createSubscriptionRow(tx, organizationId));

    const update: Partial<Subscription> = {
      provider: PaymentProvider.STRIPE,
      updatedAt: new Date(),
    };

    if (event.providerSubscriptionId) {
      update.providerSubscriptionId = event.providerSubscriptionId;
    }
    if (event.providerCustomerId) {
      update.providerCustomerId = event.providerCustomerId;
    }
    if (event.plan) update.plan = event.plan;
    if (event.status) update.status = event.status;
    if (event.currentPeriodStart) update.currentPeriodStart = event.currentPeriodStart;
    if (event.currentPeriodEnd) update.currentPeriodEnd = event.currentPeriodEnd;
    if (event.cancelAtPeriodEnd !== undefined) {
      update.cancelAtPeriodEnd = event.cancelAtPeriodEnd ? "true" : "false";
    }

    await tx.update(subscription).set(update).where(eq(subscription.id, sub.id));

    if (
      event.type === "invoice.paid" &&
      event.amount !== null &&
      event.providerPaymentId
    ) {
      await tx
        .insert(payment)
        .values({
          id: crypto.randomUUID(),
          organizationId,
          subscriptionId: sub.id,
          provider: PaymentProvider.STRIPE,
          providerPaymentId: event.providerPaymentId,
          amount: event.amount ? String(event.amount) : null,
          currency: event.currency?.toUpperCase() ?? null,
          status: "succeeded",
          paidAt: new Date(),
        } as NewPayment)
        .onConflictDoNothing({
          target: [payment.provider, payment.providerPaymentId],
        });
    }
  });
}

export async function handleKkiapayWebhook(
  payload: KkiapayWebhookPayload,
): Promise<void> {
  const { transactionId } = parseKkiapayWebhook(payload);
  const rawPayload = payload as unknown as Record<string, unknown>;
  let data = rawPayload.data as
    | { organizationId?: string; paymentId?: string }
    | string
    | undefined;

  if (typeof data === "string") {
    try {
      data = JSON.parse(data) as {
        organizationId?: string;
        paymentId?: string;
      };
    } catch {
      data = undefined;
    }
  }

  const organizationId = data?.organizationId;
  const paymentId = data?.paymentId;
  if (!organizationId || !paymentId) {
    throw new BadRequestError("KKiapay payment binding data is missing");
  }

  await verifyKkiapayPayment(organizationId, transactionId, paymentId);
}

export async function verifyKkiapayPayment(
  organizationId: string,
  transactionId: string,
  paymentId: string,
): Promise<void> {
  const { transaction } = await verifyKkiapayTransaction(
    { transactionId },
    serverEnv,
  );

  if (transaction.status !== "SUCCESS") {
    throw new BadRequestError("KKiapay transaction was not successful");
  }
  if (transaction.partnerId !== paymentId) {
    throw new BadRequestError("KKiapay transaction does not match this payment");
  }

  await creditOneTimePayment(organizationId, {
    provider: PaymentProvider.KKIAPAY,
    providerPaymentId: transactionId,
    amount: String(transaction.amount),
    currency: "XOF",
    metadata: { phone: transaction.phone },
    pendingPaymentId: paymentId,
  });
}

export async function handleFedaPayWebhook(
  payload: unknown,
): Promise<void> {
  const parsed = parseFedaPayWebhook(payload);
  const event = normalizeFedaPayWebhook(parsed);

  const transaction = await getFedaPayTransaction(event.transactionId, serverEnv);
  if (transaction.status !== "approved") {
    throw new BadRequestError("FedaPay transaction was not approved");
  }

  const metadata = (transaction.metadata ?? transaction.custom_metadata) as
    | { organizationId?: string; plan?: string; subscriptionId?: string }
    | undefined;
  const organizationId = metadata?.organizationId;
  if (!organizationId) {
    throw new BadRequestError("FedaPay webhook missing organizationId metadata");
  }

  await creditOneTimePayment(organizationId, {
    provider: PaymentProvider.FEDAPAY,
    providerPaymentId: String(event.transactionId),
    amount: String(event.amount),
    currency: event.currency,
    metadata: { reference: event.reference },
  });
}

async function creditOneTimePayment(
  organizationId: string,
  paymentData: {
    provider: PaymentProvider;
    providerPaymentId: string;
    amount: string;
    currency: string;
    metadata?: Record<string, unknown>;
    pendingPaymentId?: string;
  },
  runInTenant: TenantRunner = withTenant,
): Promise<void> {
  const periodDays = 30;

  await runInTenant(organizationId, async (tx) => {
    const matchingPayments = await tx
      .select({
        id: payment.id,
        status: payment.status,
      })
      .from(payment)
      .where(
        and(
          eq(payment.provider, paymentData.provider),
          eq(payment.providerPaymentId, paymentData.providerPaymentId),
        ),
      )
      .limit(1);
    const matchingPayment = matchingPayments[0];
    if (matchingPayment?.status === "succeeded") return;

    const existing = await tx
      .select()
      .from(subscription)
      .where(eq(subscription.organizationId, organizationId))
      .limit(1);

    const sub = existing[0] ?? (await createSubscriptionRow(tx, organizationId));
    let creditedPayment: { id: string } | undefined;

    if (matchingPayment) {
      const rows = await tx
        .update(payment)
        .set({
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: "succeeded",
          paidAt: new Date(),
          metadata: paymentData.metadata,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(payment.id, matchingPayment.id),
            eq(payment.status, "pending"),
          ),
        )
        .returning({ id: payment.id });
      creditedPayment = rows[0];
    } else if (paymentData.pendingPaymentId) {
      const pendingPayments = await tx
        .select({
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
        })
        .from(payment)
        .where(
          and(
            eq(payment.id, paymentData.pendingPaymentId),
            eq(payment.provider, paymentData.provider),
            eq(payment.status, "pending"),
          ),
        )
        .limit(1);
      const pendingPayment = pendingPayments[0];
      if (
        !pendingPayment ||
        pendingPayment.amount !== paymentData.amount ||
        pendingPayment.currency !== paymentData.currency
      ) {
        throw new BadRequestError("KKiapay payment amount or owner does not match");
      }

      const rows = await tx
        .update(payment)
        .set({
          providerPaymentId: paymentData.providerPaymentId,
          status: "succeeded",
          paidAt: new Date(),
          metadata: paymentData.metadata,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(payment.id, pendingPayment.id),
            eq(payment.status, "pending"),
          ),
        )
        .returning({ id: payment.id });
      creditedPayment = rows[0];
    } else {
      const rows = await tx
        .insert(payment)
        .values({
          id: crypto.randomUUID(),
          organizationId,
          subscriptionId: sub.id,
          provider: paymentData.provider,
          providerPaymentId: paymentData.providerPaymentId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: "succeeded",
          paidAt: new Date(),
          metadata: paymentData.metadata,
        } as NewPayment)
        .onConflictDoNothing({
          target: [payment.provider, payment.providerPaymentId],
        })
        .returning({ id: payment.id });
      creditedPayment = rows[0];
    }

    if (!creditedPayment) return;

    const baseDate = sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) > new Date()
      ? new Date(sub.currentPeriodEnd)
      : new Date();
    const newPeriodEnd = extendPeriodEnd(periodDays, baseDate);

    await tx
      .update(subscription)
      .set({
        plan: sub.plan === Plan.STARTER ? Plan.PRO : sub.plan,
        status: "active" as SubscriptionStatus,
        provider: paymentData.provider,
        currentPeriodEnd: newPeriodEnd,
        currentPeriodStart: sub.currentPeriodStart ?? new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscription.id, sub.id));
  });
}

async function getOrCreateSubscription(
  organizationId: string,
  runInTenant: TenantRunner = withTenant,
): Promise<Subscription> {
  return runInTenant(organizationId, async (tx) => {
    const rows = await tx
      .select()
      .from(subscription)
      .where(eq(subscription.organizationId, organizationId))
      .limit(1);

    if (rows[0]) return rows[0];
    return createSubscriptionRow(tx, organizationId);
  });
}

async function createSubscriptionRow(
  tx: TenantTx,
  organizationId: string,
): Promise<Subscription> {
  const values: NewSubscription = {
    id: crypto.randomUUID(),
    organizationId,
    plan: Plan.STARTER,
    status: "inactive" as SubscriptionStatus,
  };

  const rows = await tx.insert(subscription).values(values).returning();
  const created = rows[0];
  if (!created) throw new InternalError("Failed to create subscription");
  return created;
}
