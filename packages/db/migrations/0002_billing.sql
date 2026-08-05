-- ─────────────────────────────────────────────────────────────────────────────
-- 0002_billing.sql
--
-- Billing tables: subscription + payment.
--
-- Every business table carries organizationId and is protected by RLS.
-- Run via: pnpm --filter @rk-kit/db db:migrate
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── subscription ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "subscription" (
  "id" text PRIMARY KEY,
  "organizationId" text NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
  "plan" text NOT NULL DEFAULT 'starter',
  "status" text NOT NULL DEFAULT 'inactive',
  "provider" text,
  "providerSubscriptionId" text,
  "providerCustomerId" text,
  "currentPeriodStart" timestamp,
  "currentPeriodEnd" timestamp,
  "cancelAtPeriodEnd" text DEFAULT 'false',
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "subscription_organizationId_idx" ON "subscription" ("organizationId");
CREATE INDEX IF NOT EXISTS "subscription_providerSubscriptionId_idx" ON "subscription" ("providerSubscriptionId");

-- ─── payment ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "payment" (
  "id" text PRIMARY KEY,
  "organizationId" text NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
  "subscriptionId" text REFERENCES "subscription" ("id") ON DELETE SET NULL,
  "provider" text NOT NULL,
  "providerPaymentId" text,
  "amount" text,
  "currency" text DEFAULT 'XOF',
  "status" text NOT NULL DEFAULT 'pending',
  "metadata" jsonb,
  "paidAt" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "payment_organizationId_idx" ON "payment" ("organizationId");
CREATE INDEX IF NOT EXISTS "payment_providerPaymentId_idx" ON "payment" ("providerPaymentId");

-- ─── RLS policies ─────────────────────────────────────────────────────────────
-- Ensure the restricted app_user role can access the new tables.
GRANT SELECT, INSERT, UPDATE, DELETE ON "subscription" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "payment" TO app_user;

ALTER TABLE "subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscription" FORCE ROW LEVEL SECURITY;

ALTER TABLE "payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payment" FORCE ROW LEVEL SECURITY;

CREATE POLICY "subscription_tenant_isolation"
  ON "subscription"
  USING ("organizationId" = current_setting('app.current_organization_id', true))
  WITH CHECK ("organizationId" = current_setting('app.current_organization_id', true));

CREATE POLICY "payment_tenant_isolation"
  ON "payment"
  USING ("organizationId" = current_setting('app.current_organization_id', true))
  WITH CHECK ("organizationId" = current_setting('app.current_organization_id', true));
