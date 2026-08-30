# RK Kit — Ship your SaaS in days, not months

[![Version](https://img.shields.io/npm/v/create-rk-kit)](https://www.npmjs.com/package/create-rk-kit)
[![License](https://img.shields.io/github/license/chrisregis100/regis-kit-starter)](LICENSE)
![Node](https://img.shields.io/badge/node-%3E%3D22-339933)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)

A production-ready, open-source SaaS starter for teams that want to stop rebuilding auth, billing, and tenant isolation from scratch. Authentication, landing page, multi-tenant dashboard, database, and deployment plumbing — all wired together and ready to customize.

```bash
npx create-rk-kit@latest my-saas
```

**[Documentation](#table-of-contents) · [Quick Start](#quick-start) · [Live Demo](#live-demo)**

---

## Why RK Kit?

Most SaaS projects waste the first two weeks on the same boilerplate: auth flow, database setup, team invites, landing page, and Docker config. RK Kit ships all of that on day one so you can focus on your product.

- **Start fast**: one CLI command scaffolds the full monorepo and configures the environment.
- **Stay secure**: PostgreSQL Row-Level Security enforces tenant isolation at the database level.
- **Scale cleanly**: packages are split by concern (auth, db, config, errors, UI) inside a pnpm + Turborepo workspace.
- **Deploy anywhere**: builds to a self-contained Docker image compatible with Render, Railway, Fly.io, or any VPS.

## What’s included

| Feature | Details |
|---|---|
| **Authentication** | Email/password, Google & GitHub OAuth, password reset, sessions, organizations, and role-based access via [Better Auth](https://www.better-auth.com/). |
| **Multi-tenancy** | Organizations with invites, member roles, and PostgreSQL RLS enforced on every business table. |
| **Transactional email** | Password reset, organization invitations, and email verification via [Brevo](https://www.brevo.com/). Optional — logs instead of sending when unconfigured. |
| **Payments** | Optional providers: [Stripe](https://stripe.com/) (subscriptions), [KKiapay](https://kkiapay.me/) and [FedaPay](https://fedapay.com/) (mobile money, West Africa). Enable only the ones you configure. |
| **Landing page** | Hero, features, pricing, testimonials, and footer — fully editable React components. |
| **Dashboard shell** | Navigation, team management, settings, and billing — protected server-side. |
| **Database** | PostgreSQL, [Drizzle ORM](https://orm.drizzle.team/), migrations, and RLS policies. |
| **UI primitives** | [Radix UI](https://www.radix-ui.com/) + [Tailwind CSS v4](https://tailwindcss.com/) + [CVA](https://cva.style/) components. |
| **Quality gates** | TypeScript, lint, Vitest tests, RLS integration tests, smoke test, and CI. |
| **Deployment** | Dockerfile, Docker Compose, and platform-specific deployment notes. |
| **AI agent handbook** | Conventions and architecture docs in `docs/ai-skills` to onboard AI assistants quickly. |

## Stack

- **Framework**: [TanStack Start](https://tanstack.com/start/) (default) or [Next.js App Router](https://nextjs.org/docs/app)
- **Auth**: [Better Auth](https://www.better-auth.com/)
- **Email**: [Brevo](https://www.brevo.com/) transactional API (`@getbrevo/brevo`)
- **Database**: PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/) + RLS
- **Styling**: Tailwind CSS v4 + Radix UI
- **Workspace**: pnpm workspaces + [Turborepo](https://turbo.build/)
- **Runtime**: Node.js >= 22

## Quick start

```bash
# Scaffold a new project
npx create-rk-kit@latest my-saas

# Or with pnpm
pnpm dlx create-rk-kit@latest my-saas
```

The first prompt selects TanStack Start (default) or Next.js App Router. The
remaining prompts configure the database name and intended OAuth providers.

```bash
cd my-saas
pnpm install
docker compose up -d
pnpm --filter @rk-kit/db db:migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Live demo

A hosted demo is coming soon. Until then, run the installer locally to see the landing page and dashboard in under five minutes.

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
   - [CLI installer (recommended)](#cli-installer-recommended)
   - [Manual install](#manual-install)
3. [Configuration guide](#configuration-guide)
4. [Database setup](#database-setup)
5. [Development workflow](#development-workflow)
6. [Testing & quality gates](#testing--quality-gates)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [Project architecture](#project-architecture)
10. [Package installer development](#package-installer-development)
11. [Contributing](#contributing)
12. [License](#license)

## Prerequisites

- **Node.js** `>= 22` (LTS recommended)
- **pnpm** `>= 10.29.3` — enable via Corepack:
  ```bash
  corepack enable
  corepack prepare pnpm@10.29.3 --activate
  ```
- **Docker** + **Docker Compose** v2 (for PostgreSQL)
- **Git**
- **OpenSSL** (for generating `BETTER_AUTH_SECRET` locally)

All commands below are run from the repository root unless stated otherwise.

## Installation

### CLI installer (recommended)

The `create-rk-kit` CLI scaffolds the same RK Kit monorepo with either a
TanStack Start or Next.js App Router web shell.

```bash
# npm
npx create-rk-kit@latest my-saas

# pnpm
pnpm dlx create-rk-kit@latest my-saas

# yarn
yarn create rk-kit my-saas
```

The installer performs the following steps automatically:

1. Asks for the app framework first (TanStack Start is the default).
2. Asks for a project name only when it is omitted from the command.
3. Asks for the database name and intended OAuth providers.
4. Copies the monorepo and activates the selected `apps/web` shell.
5. Generates a secure `BETTER_AUTH_SECRET` and writes `.env`.
6. Prints the next commands.

After the installer finishes:

```bash
cd my-saas
pnpm install
docker compose up -d
pnpm --filter @rk-kit/db db:migrate
pnpm dev              # http://localhost:3000
```

> The CLI uses the GitHub repository `chrisregis100/regis-kit-starter` by default. If you are working from a fork or a private repo, set the `RK_KIT_TEMPLATE_REPO` environment variable before running the installer:
>
> ```bash
> RK_KIT_TEMPLATE_REPO=your-org/your-repo npx create-rk-kit@latest my-saas
> ```
>
> The override must contain `templates/nextjs-app-router` to support the
> Next.js selection.

### Manual install

If you prefer to set everything up by hand:

```bash
# 1. Clone the repo
git clone https://github.com/<owner>/regis-kit-starter.git my-saas
cd my-saas

# 2. Generate a strong auth secret
openssl rand -base64 32

# 3. Copy and edit the environment file
cp .env.example .env
# Edit .env: paste the secret and configure optional OAuth providers.

# 4. Install dependencies and build shared packages
pnpm install
pnpm turbo run build --filter=!@rk-kit/web

# 5. Start PostgreSQL
docker compose up -d

# 6. Apply migrations
pnpm --filter @rk-kit/db db:migrate

# 7. Start the dev server
pnpm dev              # http://localhost:3000
```

## Configuration guide

Environment variables are loaded from the monorepo root `.env` file and validated by `@rk-kit/config`. The app fails fast at startup if a required variable is missing or malformed.

### Required variables

| Variable | Purpose | Format |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://<user>:<password>@<host>:<port>/<db>` |
| `BETTER_AUTH_SECRET` | Signing secret for sessions and tokens | `openssl rand -base64 32` (min 32 chars) |
| `BETTER_AUTH_URL` | Public base URL of the app | `http://localhost:3000` for local dev |
| `PORT` | HTTP port the dev server listens on | `3000` (default) |
| `NODE_ENV` | Runtime environment | `development` / `test` / `production` |

### PostgreSQL variables (Docker Compose)

These are used only by `docker-compose.yml` to create the local database:

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_USER` | `rk_kit` | Privileged database owner used for migrations |
| `POSTGRES_PASSWORD` | `rk_kit_secret` | Database owner password |
| `POSTGRES_DB` | `rk_kit_dev` | Database name |
| `APP_DB_PASSWORD` | `rk_kit_app_secret` | Restricted `app_user` password |

The app and migration tooling intentionally use separate credentials:

```bash
DATABASE_URL=postgresql://app_user:rk_kit_app_secret@localhost:5432/rk_kit_dev
DATABASE_URL_MIGRATIONS=postgresql://rk_kit:rk_kit_secret@localhost:5432/rk_kit_dev
```

### OAuth providers (optional)

Leave a provider blank to disable it. Only configured providers appear on the login and signup pages. The callback URL pattern is always:

```
{BETTER_AUTH_URL}/api/auth/callback/{provider}
```

For local development with Google, that is:

```
http://localhost:3000/api/auth/callback/google
```

| Provider | Dashboard | Variables |
|---|---|---|
| Google | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| GitHub | [GitHub Developer Settings](https://github.com/settings/developers) | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` |
| Facebook | [Meta for Developers](https://developers.facebook.com/apps) | `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` |
| Apple | [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list) | `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`, `APPLE_APP_BUNDLE_IDENTIFIER` |
| Microsoft | [Azure App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps) | `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` |
| Discord | [Discord Developer Portal](https://discord.com/developers/applications) | `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` |
| LinkedIn | [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps) | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` |

> Apple Sign-In does **not** support `http://localhost` callbacks. Use a tunnel such as `ngrok` or configure it only for production.

### Email (Brevo, optional)

Transactional emails (password reset, organization invitations, email
verification) are sent through [Brevo](https://www.brevo.com/). Leave
`BREVO_API_KEY` empty to disable sending — emails are logged to the console
instead, so local development and first boot work without an email account.

| Variable | Description | Example |
|---|---|---|
| `BREVO_API_KEY` | Brevo API key ([Settings → API keys](https://app.brevo.com/settings/keys/api)) | `xkeysib-…` |
| `EMAIL_FROM` | Sender address — must be a [verified sender/domain](https://app.brevo.com/senders) | `no-reply@yourdomain.com` |
| `EMAIL_FROM_NAME` | Display name shown to recipients | `RK Kit` |

> The sender address must be verified in Brevo, otherwise sends are rejected.
> Email verification is wired but dormant: flip `requireEmailVerification` and
> `sendOnSignUp` in `packages/auth/src/config.ts` to enable it.

### Payments (optional)

Billing is provider-optional: fill in the variables for a provider to enable it
in the dashboard, leave the others blank. The app boots without any provider
configured.

| Provider | Use case | Variables |
|---|---|---|
| Stripe | Recurring subscriptions (cards, SEPA, …) | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PRO`, `STRIPE_PRICE_ID_ENTERPRISE` |
| KKiapay | Mobile money, cards, Wave (West Africa) | `KKIAPAY_PUBLIC_KEY`, `KKIAPAY_PRIVATE_KEY`, `KKIAPAY_SECRET_KEY`, `KKIAPAY_SANDBOX` |
| FedaPay | Mobile money, cards (West Africa) | `FEDAPAY_SECRET_KEY`, `FEDAPAY_SANDBOX` |

Webhook endpoints to register:
- Stripe: `{BETTER_AUTH_URL}/api/webhooks/stripe`
- KKiapay: `{BETTER_AUTH_URL}/api/webhooks/kkiapay`
- FedaPay: `{BETTER_AUTH_URL}/api/webhooks/fedapay`

### Docker production variables

When running the full production image via `docker compose --profile app up`, Compose injects the following defaults if they are not set:

```bash
DATABASE_URL_DOCKER=postgresql://app_user:${APP_DB_PASSWORD}@postgres:5432/${POSTGRES_DB}
BETTER_AUTH_URL=http://localhost:3000
PORT=3000
HOST=0.0.0.0
```

You can override any of them in `.env`.

## Database setup

RK Kit uses **Drizzle ORM** for schema management and **PostgreSQL Row-Level Security (RLS)** for tenant isolation.

### Start PostgreSQL

```bash
# Dev database on :5432 with persistent volume
docker compose up -d
```

On first initialization, Compose creates the non-superuser `app_user` runtime
role. The application connects as this role so PostgreSQL enforces RLS.

### Apply migrations

```bash
pnpm --filter @rk-kit/db db:migrate
```

### Generate a new migration after schema changes

```bash
pnpm --filter @rk-kit/db db:generate
```

### Inspect the database

```bash
pnpm --filter @rk-kit/db db:studio
```

> ⚠️ **RLS note**: the runtime `DATABASE_URL` must connect as the restricted `app_user` role, not as the PostgreSQL owner — superusers bypass row-level security. Use `DATABASE_URL_MIGRATIONS` only for migrations. See [docs/ai-skills/data-access.md](docs/ai-skills/data-access.md).

## Development workflow

```bash
pnpm dev                  # Start the selected web framework on :3000
pnpm build                # Build the web app and shared packages
pnpm lint                 # Run linters across the workspace
pnpm typecheck            # Run TypeScript checks across the workspace
pnpm test                 # Run unit tests across the workspace
```

### Useful workspace commands

| Command | Description |
|---|---|
| `pnpm dev` | Dev servers (Turbo) |
| `pnpm turbo run lint typecheck build test` | Full quality gate |
| `pnpm --filter @rk-kit/db db:generate` | Generate a migration from schema |
| `pnpm --filter @rk-kit/db db:migrate` | Apply migrations |
| `pnpm --filter @rk-kit/db db:studio` | Drizzle Studio (database UI) |
| `pnpm --filter @rk-kit/db db:push` | Push schema without migration files (use with care) |
| `bash scripts/smoke.sh` | Boot the built server and check core routes |
| `bash scripts/check-ai-docs.sh` | Verify `docs/ai-skills` is in sync |
| `docker compose --profile app up --build` | Run the production image locally |

## Testing & quality gates

Before opening a PR or deploying, run the full gate:

```bash
pnpm turbo run lint typecheck build test
bash scripts/smoke.sh
bash scripts/check-ai-docs.sh
```

- `lint` / `typecheck`: TypeScript checks (no ESLint config yet)
- `test`: Vitest unit and RLS integration tests
- `smoke.sh`: Builds the app and asserts core routes return the expected status
- `check-ai-docs.sh`: Ensures every package/app is documented in `docs/ai-skills`

## Deployment

The web app builds to a self-contained Nitro bundle (`node .output/server/index.mjs`) binding `0.0.0.0:$PORT` — compatible with Render, Railway, Fly.io, or any Docker host.

### Docker (recommended for self-hosting)

```bash
docker compose --profile app up --build
```

The production image is defined in [`apps/web/Dockerfile`](apps/web/Dockerfile). Secrets are injected at runtime; dummy values are used only during the build step so the image stays portable.

### Platform-specific notes

- **Render**: set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` as environment variables. Render provides `PORT` automatically.
- **Railway / Fly.io**: same variables; bind to `0.0.0.0` and read `PORT` from the environment.
- **VPS**: build the image, run the container, and point a reverse proxy at `http://127.0.0.1:3000`.

### Deploy checklist

- [ ] `BETTER_AUTH_SECRET` is at least 32 characters and unique per environment
- [ ] `BETTER_AUTH_URL` matches the public HTTPS URL
- [ ] `DATABASE_URL` points to a migrated PostgreSQL database
- [ ] OAuth callback URLs are registered with the public URL
- [ ] `NODE_ENV=production` is set
- [ ] Smoke test passes against the deployed build

## Troubleshooting

### `❌ Invalid server environment variables`

`@rk-kit/config` validates the environment at startup. Make sure `.env` exists at the repository root and contains all required variables. Copy from `.env.example` and fill in the blanks.

### Database connection errors

1. Verify PostgreSQL is running: `docker compose ps`
2. Verify `DATABASE_URL` uses `app_user` and `APP_DB_PASSWORD` from `.env`
3. Check the database is reachable: `pg_isready -h localhost -p 5432`
4. If you changed `POSTGRES_*` or `APP_DB_PASSWORD` after the first `docker compose up`, the volume still contains the old credentials. Either restore the original values or prune the volume (`docker compose down -v` — this destroys data).

### Migrations fail

Ensure the database is reachable and that `DATABASE_URL_MIGRATIONS` uses the
owner credentials, then run:

```bash
pnpm --filter @rk-kit/db db:migrate
```

### OAuth redirects fail locally

- The callback must match exactly: trailing slashes, `http` vs `https`, and port all matter.
- Apple Sign-In requires HTTPS even in development. Use `ngrok http 3000` and update `BETTER_AUTH_URL` and the Apple callback URL accordingly.

### Smoke test fails

The smoke test requires a built app and a migrated database. Run:

```bash
pnpm build
pnpm --filter @rk-kit/db db:migrate
bash scripts/smoke.sh
```

## Project architecture

```
apps/web                  selected product shell (TanStack Start or Next.js)
apps/web/src/services     business logic (Drizzle via withTenant)
apps/web/src/server       TanStack Start server functions (TanStack variant)
apps/web/src/api          REST handlers + middleware for /api/v1/*
templates/nextjs-app-router Next.js App Router shell used by create-rk-kit
packages/config           Zod-validated environment
packages/db               Drizzle + migrations + RLS + withTenant
packages/auth             Better Auth + session helpers
packages/billing          billing core: plans, provider detection, subscription helpers
packages/payments-stripe  Stripe subscriptions: Checkout, Portal, webhooks
packages/payments-kkiapay KKiapay mobile-money widget + verify + webhooks
packages/payments-fedapay FedaPay transactions + webhooks
packages/email            transactional email (Brevo) — server-only
packages/errors           typed error hierarchy + HTTP serialization
packages/ui               shadcn-style primitives (Radix + CVA + Tailwind)
packages/create-rk-kit    interactive CLI installer for new projects
docs/ai-skills            architecture, conventions, data access, API layer, add-module guide
```

Modules (Redis, monitoring, jobs, audit log) are added **only on a real trigger** — see [docs/ai-skills/add-module.md](docs/ai-skills/add-module.md). The email module (`@rk-kit/email`) ships wired to Better Auth and is enabled by setting `BREVO_API_KEY`. The billing/payment modules are optional and enabled by their provider-specific environment variables.

## Package installer development

The `create-rk-kit` CLI lives in `packages/create-rk-kit` and uses only Node.js built-in modules so it can be published to npm without heavy dependencies.

Build and test it from the monorepo:

```bash
pnpm --filter create-rk-kit build
node packages/create-rk-kit/bin/create-rk-kit.mjs my-test-project
```

To publish it to npm:

```bash
pnpm --filter create-rk-kit publish
```

Set `RK_KIT_TEMPLATE_REPO=your-org/your-repo` if the template is hosted on a fork or private repository.

## Contributing

Contributions are welcome. Please read the [AI-agent handbook](docs/ai-skills/README.md) before making structural changes, and run the full quality gate before opening a pull request.

## License

[MIT](LICENSE) © Régis KIKI

## Next steps

1. Run the project locally with `pnpm dev`.
2. Customize the landing page in `apps/web/src/components/landing/`.
3. Add your first business domain in `apps/web/src/services/`.
4. Read the [AI-agent handbook](docs/ai-skills/README.md) before making structural changes.
