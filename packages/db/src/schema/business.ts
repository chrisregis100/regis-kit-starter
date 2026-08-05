/**
 * Business domain tables.
 *
 * Every business table MUST have:
 *   1. `organizationId` NOT NULL + FK to `organization.id`
 *   2. An index on `organizationId` for tenant-scoped query performance
 *   3. RLS policy added in migration 0001_rls_policies.sql
 *
 * Services query these tables exclusively through `withTenant(orgId, fn)`
 * so the RLS policy can verify the caller's organization via
 * `current_setting('app.current_organization_id', true)`.
 */
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organization } from "./auth.js";

// ─── Projects (example business entity) ──────────────────────────────────────

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    /** Tenant discriminator — ALL queries must be scoped to this value. */
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (t) => [
    /** Clustered index for all tenant-scoped queries. */
    index("project_organizationId_idx").on(t.organizationId),
  ],
);

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;

// ─── Subscriptions and payments (billing) ─────────────────────────────────────

export const subscription = pgTable(
  "subscription",
  {
    id: text("id").primaryKey(),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    plan: text("plan").notNull().default("starter"),
    status: text("status").notNull().default("inactive"),
    /** Provider that owns the active subscription (stripe, kkiapay, fedapay). */
    provider: text("provider"),
    /** Provider-specific subscription id. */
    providerSubscriptionId: text("providerSubscriptionId"),
    /** Provider-specific customer id (used for Stripe Customer Portal). */
    providerCustomerId: text("providerCustomerId"),
    currentPeriodStart: timestamp("currentPeriodStart"),
    currentPeriodEnd: timestamp("currentPeriodEnd"),
    cancelAtPeriodEnd: text("cancelAtPeriodEnd").default("false"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (t) => [
    index("subscription_organizationId_idx").on(t.organizationId),
    index("subscription_providerSubscriptionId_idx").on(t.providerSubscriptionId),
  ],
);

export type Subscription = typeof subscription.$inferSelect;
export type NewSubscription = typeof subscription.$inferInsert;

export const payment = pgTable(
  "payment",
  {
    id: text("id").primaryKey(),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    subscriptionId: text("subscriptionId").references(() => subscription.id, {
      onDelete: "set null",
    }),
    provider: text("provider").notNull(),
    providerPaymentId: text("providerPaymentId"),
    amount: text("amount"),
    currency: text("currency").default("XOF"),
    status: text("status").notNull().default("pending"),
    metadata: jsonb("metadata"),
    paidAt: timestamp("paidAt"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (t) => [
    index("payment_organizationId_idx").on(t.organizationId),
    index("payment_providerPaymentId_idx").on(t.providerPaymentId),
    uniqueIndex("payment_provider_providerPaymentId_uidx").on(
      t.provider,
      t.providerPaymentId,
    ),
  ],
);

export type Payment = typeof payment.$inferSelect;
export type NewPayment = typeof payment.$inferInsert;
