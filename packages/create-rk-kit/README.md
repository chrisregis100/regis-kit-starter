# create-rk-kit

CLI installer for the [RK Kit](https://github.com/chrisregis100/regis-kit-starter) SaaS boilerplate. Scaffolds a production-ready TanStack Start or Next.js App Router monorepo with authentication and multi-tenant PostgreSQL.

## Quick start

```bash
# npm
npx create-rk-kit@latest my-saas

# pnpm
pnpm dlx create-rk-kit@latest my-saas

# yarn
yarn create rk-kit my-saas
```

Then follow the interactive prompts. When the installer finishes:

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
- **Frontend** — [TanStack Start](https://tanstack.com/start/), [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/) primitives, and a ready-to-customize landing page.
- **Workspace** — [pnpm](https://pnpm.io/) workspaces + [Turborepo](https://turbo.build/) with shared packages for config, auth, database, errors, and UI.
- **Quality gates** — TypeScript, lint, tests, smoke tests, and a production Dockerfile.

## Prerequisites

- **Node.js** `>= 22`
- **pnpm** `>= 10.29.3` (the installer uses pnpm for dependency installation)
- **Docker** + **Docker Compose** v2 (for the local PostgreSQL database)
- **Git**

Enable pnpm via Corepack:

```bash
corepack enable
corepack prepare pnpm@10.29.3 --activate
```

## What the installer does

1. Creates a new directory named after your project.
2. Asks for the app framework, project name (when omitted), database name, and OAuth providers.
3. Downloads the RK Kit template from GitHub (or copies it from the local monorepo when running inside it).
4. Generates a secure `BETTER_AUTH_SECRET`.
5. Writes a ready-to-use `.env` file.
6. Selects the TanStack Start shell or replaces it with the Next.js App Router shell.
7. Prints the next steps.

## Interactive prompts

During setup you will be asked for:

| Prompt        | Default               | Purpose                                      |
| ------------- | --------------------- | -------------------------------------------- |
| App framework | TanStack Start        | TanStack Start or Next.js App Router         |
| Project name  | `my-saas`             | Asked only when the command omits a name     |
| Database name | `my-saas` → `my_saas` | PostgreSQL database name                     |
| OAuth         | `none`                | Choose `none`, `google`, `github`, or `both` |

PostgreSQL uses the existing local defaults (`rk_kit` / `rk_kit_secret`) and
the web app uses port `3000`. Add OAuth client IDs and secrets to `.env` after
scaffolding; the selected providers identify what you intend to configure.

## Generated environment variables

The installer writes a root `.env` file with the following variables already filled in:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `APP_DB_PASSWORD` (securely generated for the restricted runtime role)
- `DATABASE_URL` (restricted `app_user` runtime connection)
- `DATABASE_URL_MIGRATIONS` (privileged owner connection)
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `PORT`
- `NODE_ENV`

Additional OAuth providers (Facebook, Apple, Microsoft, Discord, LinkedIn) are listed in `.env` with empty values for later configuration.

## Use a custom template repository

By default the installer downloads `chrisregis100/regis-kit-starter`. To use a fork or a private repo, set the `RK_KIT_TEMPLATE_REPO` environment variable:

```bash
RK_KIT_TEMPLATE_REPO=your-org/your-repo npx create-rk-kit@latest my-saas
```

The override must use the RK Kit repository layout and include
`templates/nextjs-app-router` when the Next.js option is selected.

## Manual install alternative

If you prefer to set up the project by hand, clone the template repository and follow the [main README](https://github.com/chrisregis100/regis-kit-starter#readme).

## Troubleshooting

### Project name must contain only letters, numbers, underscores, and hyphens

The directory name is validated. Use a simple kebab-case or snake-case name, for example `my-saas` or `my_saas`.

### Directory already exists

The installer will not overwrite an existing directory. Remove or rename the target directory first.

### PostgreSQL did not become healthy in time

Make sure Docker is running and `docker compose` is available. If the database takes longer to start, run the migrations manually:

```bash
cd my-saas
docker compose up -d
pnpm --filter @rk-kit/db db:migrate
```

### Template download fails

If you are behind a proxy or the GitHub repository is private, verify your Git access or set `RK_KIT_TEMPLATE_REPO` to a reachable repository.

## Development

To work on the CLI itself, run it from the RK Kit monorepo:

```bash
pnpm --filter create-rk-kit build
node packages/create-rk-kit/bin/create-rk-kit.mjs my-test-project
```

To publish a new version:

```bash
pnpm --filter create-rk-kit publish
```

## License

[MIT](https://github.com/chrisregis100/regis-kit-starter#blob/main/LICENSE)
