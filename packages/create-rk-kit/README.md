# create-rk-kit

CLI installer for the [RK Kit](https://github.com/chrisregis100/regis-kit-starter) SaaS boilerplate. Scaffolds a production-ready TanStack Start or Next.js App Router monorepo with authentication, a multi-tenant PostgreSQL setup, and a ready-to-edit landing page.

## Quick start

```bash
# npm
npx create-rk-kit@latest my-saas

# pnpm
pnpm dlx create-rk-kit@latest my-saas

# yarn
yarn create rk-kit my-saas
```

Answer the prompts, then run the printed follow-up commands:

```bash
cd my-saas
pnpm install
docker compose up -d
pnpm --filter @rk-kit/db db:migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## What is RK Kit?

RK Kit is an opinionated, open-source SaaS starter built for teams that want to ship fast without compromising on architecture:

- **Authentication** — email/password, Google & GitHub OAuth, password reset, sessions, and organization-based multi-tenancy via [Better Auth](https://www.better-auth.com/).
- **Database** — PostgreSQL, [Drizzle ORM](https://orm.drizzle.team/), migrations, and Row-Level Security (RLS) for tenant isolation.
- **Frontend** — [TanStack Start](https://tanstack.com/start/) or [Next.js App Router](https://nextjs.org/docs/app), [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/) primitives, and a ready-to-customize landing page.
- **Workspace** — [pnpm](https://pnpm.io/) workspaces + [Turborepo](https://turbo.build/) with shared packages for config, auth, database, errors, and UI.
- **Quality gates** — TypeScript, lint, tests, a smoke test, and a production Dockerfile.

## Prerequisites

- **Node.js** `>= 22`
- **pnpm** `>= 10.29.3`
- **Docker** + **Docker Compose** v2 (for the local PostgreSQL database)
- **Git** (used to clone the template when running outside the RK Kit monorepo)

Enable pnpm via Corepack:

```bash
corepack enable
corepack prepare pnpm@10.29.3 --activate
```

## What the installer does

The installer runs entirely from Node built-ins — it has **no runtime npm dependencies**.

1. Prints the banner.
2. Prompts for the **app framework** (TanStack Start by default).
3. Prompts for a **project name** only when it was omitted from the command.
4. Prompts for the **database name** and **OAuth providers**.
5. Copies the RK Kit template into the target directory:
   - If the CLI is executed from inside the RK Kit monorepo (and `RK_KIT_TEMPLATE_REPO` is not set), it copies the local checkout, skipping `node_modules`, `.git`, `.turbo`, `.output`, `.pnpm-store`, `dist`, `packages/create-rk-kit`, and the root `.env`.
   - Otherwise it runs `git clone --depth 1 https://github.com/<repo>.git <target>` and then removes the cloned `.git` directory.
6. If **Next.js App Router** was selected, replaces `apps/web` with the shell in `templates/nextjs-app-router`, preserving shared assets (styles, API routes, auth client, auth components) from the original `apps/web`. If **TanStack Start** was selected, the `templates/` directory is removed.
7. Writes a ready-to-use `.env` at the project root. For Next.js, the same file is duplicated to `apps/web/.env.local`.
8. Prints the next steps.

The installer does **not** run `pnpm install`, `docker compose up`, or any migrations — you run them yourself using the printed commands.

## Interactive prompts

The prompts always run in this order:

| # | Prompt              | Default                  | Accepted values                                                       |
| - | ------------------- | ------------------------ | --------------------------------------------------------------------- |
| 1 | **App framework**   | `1` (TanStack Start)     | `1`, `tanstack`, `tanstack-start`, `2`, `next`, `nextjs`              |
| 2 | **Project name**    | `my-saas`                | `^[a-z0-9_-]+$` — asked only when omitted from the command            |
| 3 | **Database name**   | project name (`-` → `_`) | any PostgreSQL identifier                                             |
| 4 | **OAuth providers** | `none`                   | `none`, `google`, `github`, `both` (case-insensitive, spaces ignored) |

The framework prompt displays:

```
  1. TanStack Start (default)
  2. Next.js App Router
```

The OAuth prompt is a signal only: whatever you choose, the generated `.env` contains empty `GOOGLE_*` / `GITHUB_*` client ID and secret variables — the CLI never asks for OAuth credentials. Fill them in after scaffolding.

## Generated environment variables

The installer writes a root `.env` file (and, for Next.js, a duplicate at `apps/web/.env.local`) grouped as follows.

### PostgreSQL (Docker local dev)

| Variable            | Value                                      | Notes                                                    |
| ------------------- | ------------------------------------------ | -------------------------------------------------------- |
| `POSTGRES_USER`     | `rk_kit`                                   | Privileged database owner used by migrations.            |
| `POSTGRES_PASSWORD` | `rk_kit_secret`                            | Owner password.                                          |
| `POSTGRES_DB`       | your database name                         | Defaults to the project name with `-` replaced by `_`.   |
| `APP_DB_PASSWORD`   | random 24-byte hex string (auto-generated) | Password for the restricted `app_user` runtime role.     |

### Database connection strings

The app and drizzle-kit intentionally use different credentials so RLS is enforced at runtime:

| Variable                  | Role       | Purpose                                                          |
| ------------------------- | ---------- | ---------------------------------------------------------------- |
| `DATABASE_URL`            | `app_user` | Restricted runtime connection. RLS is enforced.                  |
| `DATABASE_URL_MIGRATIONS` | `rk_kit`   | Privileged owner connection used only by drizzle-kit migrations. |

Both point to `localhost:5432/<POSTGRES_DB>`.

### Better Auth

| Variable             | Value                                          |
| -------------------- | ---------------------------------------------- |
| `BETTER_AUTH_SECRET` | random 32-byte base64 string (auto-generated). |
| `BETTER_AUTH_URL`    | `http://localhost:3000`                        |

The OAuth callback pattern is `{BETTER_AUTH_URL}/api/auth/callback/{provider}`.

### OAuth providers (stubs)

Every OAuth block is written with empty values so you can fill them in after scaffolding. Selecting `google`, `github`, or `both` at the prompt does not change the file contents — it only signals your intent.

| Provider  | Variables                                                                                             |
| --------- | ----------------------------------------------------------------------------------------------------- |
| Google    | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                                                            |
| GitHub    | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`                                                            |
| Facebook  | `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`                                                        |
| Apple     | `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`, `APPLE_APP_BUNDLE_IDENTIFIER` |
| Microsoft | `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`                                                      |
| Discord   | `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`                                                          |
| LinkedIn  | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`                                                        |

Apple Sign-In does **not** support `http://localhost` callbacks — use HTTPS (for example via `ngrok`) in development. Paste the `.p8` key contents into `APPLE_PRIVATE_KEY` and escape line breaks as `\n`.

### App

| Variable   | Value         |
| ---------- | ------------- |
| `PORT`     | `3000`        |
| `NODE_ENV` | `development` |

When deploying to Render (or any platform that injects `PORT`), bind the app to `0.0.0.0:$PORT`.

## Use a custom template repository

By default the installer downloads `chrisregis100/regis-kit-starter`. To use a fork or a private mirror, set `RK_KIT_TEMPLATE_REPO`:

```bash
RK_KIT_TEMPLATE_REPO=your-org/your-repo npx create-rk-kit@latest my-saas
```

The override:

- Must be reachable by `git clone --depth 1 https://github.com/<value>.git`.
- Must include `templates/nextjs-app-router` if you plan to select the Next.js option.
- Disables the local monorepo copy path even when the CLI runs from inside a checkout of the RK Kit repository.

## Non-interactive / CI

Interactive mode is on when `process.stdout.isTTY` is truthy **and** `CI` is not set. The banner animation and spinners are disabled otherwise.

If stdin is not a TTY, the installer reads its answers from piped stdin (one answer per line, in prompt order) and falls back to the printed default when a line is empty:

```bash
# framework = Next.js, project name via argv, database name default, no OAuth
printf "2\n\nnone\n" | npx create-rk-kit@latest my-saas
```

There are **no CLI flags** for framework, database name, or OAuth — pipe answers instead.

## Manual install alternative

If you prefer to set up the project by hand, clone the template repository and follow the [main README](https://github.com/chrisregis100/regis-kit-starter#readme).

## Post-install: optional integrations

Brevo (transactional email), Stripe, KKiapay, and FedaPay (payments) are wired in the template but disabled by default. The CLI does not prompt for them — configure them by adding the relevant variables to `.env` after scaffolding. See the [main README](https://github.com/chrisregis100/regis-kit-starter#readme) for the full list.

## Troubleshooting

### `Project name must contain only letters, numbers, underscores, and hyphens`

The directory name is validated against `^[a-z0-9_-]+$` (case-insensitive). Use a simple kebab-case or snake-case name, for example `my-saas` or `my_saas`.

### `Directory already exists`

The installer never overwrites an existing directory. Remove or rename the target directory first.

### `The selected template repository does not contain templates/nextjs-app-router`

You picked the Next.js option, but the `RK_KIT_TEMPLATE_REPO` override points to a repo that omits `templates/nextjs-app-router`. Either add that directory to your fork or select TanStack Start.

### `git clone` fails

If you are behind a proxy or the repository is private, verify your Git access, or set `RK_KIT_TEMPLATE_REPO` to a reachable repository. Running the installer from inside the RK Kit monorepo bypasses the clone entirely (unless `RK_KIT_TEMPLATE_REPO` is set).

### Migrations fail after `docker compose up -d`

Give PostgreSQL a moment to become healthy, then run the migrations manually:

```bash
cd my-saas
docker compose up -d
pnpm --filter @rk-kit/db db:migrate
```

## Development

To work on the CLI itself, run it from the RK Kit monorepo:

```bash
# Build once
pnpm --filter create-rk-kit build

# Or rebuild on save
pnpm --filter create-rk-kit dev

# Try it locally
node packages/create-rk-kit/bin/create-rk-kit.mjs my-test-project
```

Publish a new version:

```bash
pnpm --filter create-rk-kit publish
```

## License

[MIT](https://github.com/chrisregis100/regis-kit-starter/blob/main/LICENSE)
