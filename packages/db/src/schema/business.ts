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
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
