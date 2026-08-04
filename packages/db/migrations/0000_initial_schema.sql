-- ─────────────────────────────────────────────────────────────────────────────
-- 0000_initial_schema.sql
--
-- Creates all tables for Better Auth (core + organization plugin)
-- and the initial business table (project).
--
-- Run via: pnpm --filter @rk-kit/db db:migrate
-- ─────────────────────────────────────────────────────────────────────────────

--> statement-breakpoint

-- ─── Better Auth core ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "user" (
  "id"            text PRIMARY KEY NOT NULL,
  "name"          text NOT NULL,
  "email"         text NOT NULL,
  "emailVerified" boolean NOT NULL DEFAULT false,
  "image"         text,
  "createdAt"     timestamp NOT NULL,
  "updatedAt"     timestamp NOT NULL,
  CONSTRAINT "user_email_unique" UNIQUE ("email")
);

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "session" (
  "id"                     text PRIMARY KEY NOT NULL,
  "userId"                 text NOT NULL,
  "token"                  text NOT NULL,
  "expiresAt"              timestamp NOT NULL,
  "ipAddress"              text,
  "userAgent"              text,
  "activeOrganizationId"   text,
  "createdAt"              timestamp NOT NULL,
  "updatedAt"              timestamp NOT NULL,
  CONSTRAINT "session_token_unique" UNIQUE ("token")
);

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "account" (
  "id"                     text PRIMARY KEY NOT NULL,
  "userId"                 text NOT NULL,
  "accountId"              text NOT NULL,
  "providerId"             text NOT NULL,
  "accessToken"            text,
  "refreshToken"           text,
  "idToken"                text,
  "accessTokenExpiresAt"   timestamp,
  "refreshTokenExpiresAt"  timestamp,
  "scope"                  text,
  "createdAt"              timestamp NOT NULL,
  "updatedAt"              timestamp NOT NULL
);

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "verification" (
  "id"          text PRIMARY KEY NOT NULL,
  "identifier"  text NOT NULL,
  "value"       text NOT NULL,
  "expiresAt"   timestamp NOT NULL,
  "createdAt"   timestamp,
  "updatedAt"   timestamp
);

--> statement-breakpoint

-- ─── Organization plugin ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "organization" (
  "id"        text PRIMARY KEY NOT NULL,
  "name"      text NOT NULL,
  "slug"      text,
  "logo"      text,
  "metadata"  text,
  "createdAt" timestamp NOT NULL,
  CONSTRAINT "organization_slug_unique" UNIQUE ("slug")
);

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "member" (
  "id"             text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL,
  "userId"         text NOT NULL,
  "role"           text NOT NULL,
  "createdAt"      timestamp NOT NULL
);

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "invitation" (
  "id"             text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL,
  "email"          text NOT NULL,
  "role"           text,
  "status"         text NOT NULL DEFAULT 'pending',
  "expiresAt"      timestamp NOT NULL,
  "inviterId"      text NOT NULL
);

--> statement-breakpoint

-- ─── Business tables ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "project" (
  "id"             text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL,
  "name"           text NOT NULL,
  "description"    text,
  "createdAt"      timestamp NOT NULL DEFAULT now(),
  "updatedAt"      timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint

-- ─── Foreign key constraints ─────────────────────────────────────────────────

ALTER TABLE "session"
  ADD CONSTRAINT "session_userId_user_id_fk"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint

ALTER TABLE "account"
  ADD CONSTRAINT "account_userId_user_id_fk"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint

ALTER TABLE "member"
  ADD CONSTRAINT "member_organizationId_organization_id_fk"
  FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint

ALTER TABLE "member"
  ADD CONSTRAINT "member_userId_user_id_fk"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint

ALTER TABLE "invitation"
  ADD CONSTRAINT "invitation_organizationId_organization_id_fk"
  FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint

ALTER TABLE "invitation"
  ADD CONSTRAINT "invitation_inviterId_user_id_fk"
  FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint

ALTER TABLE "project"
  ADD CONSTRAINT "project_organizationId_organization_id_fk"
  FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint

-- ─── Indexes for tenant-scoped queries ───────────────────────────────────────

CREATE INDEX IF NOT EXISTS "project_organizationId_idx" ON "project" ("organizationId");

--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "member_organizationId_idx" ON "member" ("organizationId");

--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "invitation_organizationId_idx" ON "invitation" ("organizationId");
