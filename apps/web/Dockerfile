# ─────────────────────────────────────────────────────────────────────────────
# @rk-kit/web — production image
#
# Build from the MONOREPO ROOT (build context = repo root):
#   docker build -f apps/web/Dockerfile -t rk-kit-web .
#
# Runtime contract (Render/Docker):
#   - binds 0.0.0.0:$PORT (Nitro reads HOST/PORT from the environment)
#   - filesystem is ephemeral — no local writes beyond /tmp
# ─────────────────────────────────────────────────────────────────────────────

FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /repo

# Install dependencies first (better layer caching)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
COPY packages/auth/package.json packages/auth/
COPY packages/config/package.json packages/config/
COPY packages/db/package.json packages/db/
COPY packages/errors/package.json packages/errors/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile

# Build shared packages then the app
COPY tsconfig.base.json turbo.json ./
COPY packages/ packages/
COPY apps/web/ apps/web/
# Dummy env vars: @rk-kit/config validates at import; real values are
# injected at runtime, never baked into the image.
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    BETTER_AUTH_SECRET="build-time-placeholder-secret-32-chars!" \
    BETTER_AUTH_URL="http://localhost:3000" \
    pnpm turbo run build --filter=@rk-kit/web

# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app

# Nitro output is fully self-contained (bundled dependencies)
COPY --from=builder --chown=app:app /repo/apps/web/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
