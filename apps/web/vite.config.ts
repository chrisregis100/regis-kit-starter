import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");

/**
 * TanStack Start + Nitro (Node.js/Docker/Render deployment).
 *
 * Production build: `pnpm build` → `.output/server/index.mjs`.
 * Nitro's Node server reads HOST/PORT from the environment — Render sets
 * PORT automatically; we default HOST to 0.0.0.0 in the Dockerfile.
 *
 * `.env` lives at the monorepo root — envDir must point there so Vite injects
 * DATABASE_URL, BETTER_AUTH_*, etc. into process.env before SSR modules load.
 */
export default defineConfig({
  envDir: repoRoot,
  server: {
    watch: {
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/.output/**",
        "**/dist/**",
        "**/.turbo/**",
        "**/.vinxi/**",
        "**/apps/web/app/**",
      ],
    },
  },
  plugins: [
    // Order matters: tanstackStart() must come before viteReact().
    tanstackStart(),
    nitro(),
    viteReact(),
    tailwindcss(),
  ],
});
