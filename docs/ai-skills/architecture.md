# Architecture

## Workspace layout

```
rk-kit-monorepo/
├── apps/
│   └── web/                 # @rk-kit/web — TanStack Start product app
│       ├── src/routes/      # file-based routes (public, _protected layout, api/)
│       ├── src/components/  # product UI (landing, dashboard, auth, onboarding)
│       ├── src/services/    # business logic (Zod validation + withTenant)
│       └── src/lib/         # auth client, server-function guards
├── packages/
│   ├── config/              # @rk-kit/config — Zod-validated env (server/client)
│   ├── db/                  # @rk-kit/db — Drizzle + pg, migrations, RLS, withTenant
│   ├── auth/                # @rk-kit/auth — Better Auth config + session helpers
│   ├── billing/             # @rk-kit/billing — plans, provider detection, subscription helpers
│   ├── payments-stripe/     # @rk-kit/payments-stripe — Stripe Checkout, Portal, webhooks
│   ├── payments-kkiapay/    # @rk-kit/payments-kkiapay — KKiapay widget + verify + webhooks
│   ├── payments-fedapay/    # @rk-kit/payments-fedapay — FedaPay transactions + webhooks
│   ├── email/               # @rk-kit/email — transactional email (Brevo), server-only
│   ├── errors/              # @rk-kit/errors — typed errors + HTTP serialization
│   ├── ui/                  # @rk-kit/ui — shadcn-style primitives (Radix + CVA)
│   └── create-rk-kit/       # create-rk-kit CLI — scaffold new projects from this template
├── docs/ai-skills/          # this handbook
├── scripts/                 # smoke.sh, check-ai-docs.sh
├── docker-compose.yml       # postgres (default) + web (profile "app")
└── turbo.json               # build/dev/lint/typecheck/test pipeline
```

## Stack

- **Frontend/server**: TanStack Start (`@tanstack/react-start`, Vite plugin) +
  Nitro (Node server output, `node .output/server/index.mjs`)
- **Auth**: Better Auth (email/password, Google OAuth, organization plugin)
- **Email**: Brevo (`@getbrevo/brevo` v6) transactional emails — password reset,
  organization invitations, email verification. Optional: no-ops (logs) when
  `BREVO_API_KEY` is unset, so the app boots without an email provider.
- **Database**: PostgreSQL (Supabase-compatible), Drizzle ORM, drizzle-kit
  migrations, Row-Level Security for tenant isolation
- **Styling**: Tailwind CSS v4 (`@theme inline` tokens) + `@rk-kit/ui` primitives
- **Monorepo**: pnpm workspaces + Turborepo (tasks cache, `^build` dependencies)

## Layering rules

```
apps/web (routes → server functions → services)
    │  imports
    ▼
packages/auth ─→ packages/db ─→ (PostgreSQL)
packages/auth ─→ packages/email ─→ (Brevo API)
packages/config, packages/errors, packages/ui   (leaf utilities)
```

- `apps/web` **is the only place** with product/business code. It is expected
  to be customized per project (landing, dashboard, services).
- `packages/*` are shared infrastructure: generic, product-agnostic, stable.
  A fix in a package benefits every app that imports it.
- Packages never import from `apps/*`. `packages/ui` never contains business
  logic. `packages/auth`, `packages/db`, and `packages/email` are server-only.
- `packages/email` is invoked from Better Auth callbacks
  (`sendResetPassword`, `sendInvitationEmail`, `sendVerificationEmail`) in
  `packages/auth/src/config.ts`. It loads the Brevo SDK lazily so it never
  enters client bundles or test module graphs.

## Request flow (protected page)

```
Browser ──GET /dashboard──▶ Nitro/TanStack Start
  routes/_protected.tsx  beforeLoad
    └─▶ getProtectedContext()          (server fn, src/server/session-fns.ts)
          └─▶ getSession(headers)      (@rk-kit/auth → Better Auth)
                ├─ no session          → redirect /login
                ├─ no active org       → redirect /onboarding
                └─ ok → { user, organizationId } into router context
  routes/_protected/dashboard.tsx  loader
    └─▶ listProjectsFn()               (server fn, src/server/projects-fns.ts)
          └─▶ requireOrganization(headers)
          └─▶ listProjects(orgId)      (src/services/project-service.ts)
                └─▶ withTenant(orgId, tx => tx.select().from(project))
                      └─ SET LOCAL app.current_organization_id = orgId
                      └─ RLS policy filters rows to that tenant
```

## Multi-tenancy model

- A **tenant = a Better Auth organization**. Users can belong to several
  organizations; the active one is stored on the session
  (`session.activeOrganizationId`).
- Every business table carries `organizationId NOT NULL` + an index, plus an
  RLS policy (`ENABLE` + `FORCE ROW LEVEL SECURITY`).
- Runtime connects as the restricted `app_user` role (`NOBYPASSRLS`);
  migrations connect as the owner role. Two different `DATABASE_URL`s.
- Fail-safe: without a tenant context, RLS returns **zero rows** — a forgotten
  `withTenant` produces empty results, never a cross-tenant leak.

## Billing and payments

Billing is implemented as a set of optional, provider-specific packages. Each
provider is activated only by its environment variables, so the app boots even
when none or only some providers are configured.

| Package | Responsibility | Activation |
|---|---|---|
| `@rk-kit/billing` | Provider detection, plans, subscription lifecycle helpers | Always present, no secrets |
| `@rk-kit/payments-stripe` | Stripe Checkout, Customer Portal, webhooks | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_ID_PRO` |
| `@rk-kit/payments-kkiapay` | KKiapay widget integration, server-side verification, webhooks | `KKIAPAY_PUBLIC_KEY`, `KKIAPAY_PRIVATE_KEY`, `KKIAPAY_SECRET_KEY` |
| `@rk-kit/payments-fedapay` | FedaPay transaction creation, callbacks, webhooks | `FEDAPAY_SECRET_KEY` |

The dashboard (`/billing`) reads the available providers from the server and
renders only the configured payment options. Stripe handles recurring
subscriptions natively; KKiapay and FedaPay are used for one-time mobile-money
payments that extend the current subscription period.

Webhook endpoints are exposed under `/api/webhooks/*` and verify provider
signatures or transaction status before updating local subscription state.

## Deployment contract

- The server binds `0.0.0.0:$PORT` (Nitro reads `HOST`/`PORT`) — required by
  Render and most container platforms.
- The Docker image (`apps/web/Dockerfile`, build context = repo root) contains
  only the self-contained `.output` bundle and runs as a non-root user.
- The filesystem is treated as ephemeral: no local writes beyond `/tmp`.
