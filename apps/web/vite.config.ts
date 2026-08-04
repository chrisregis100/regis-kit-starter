import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * TanStack Start + Nitro (Node.js/Docker/Render deployment).
 *
 * Production build: `pnpm build` → `.output/server/index.mjs`.
 * Nitro's Node server reads HOST/PORT from the environment — Render sets
 * PORT automatically; we default HOST to 0.0.0.0 in the Dockerfile.
 */
export default defineConfig({
  plugins: [
    // Order matters: tanstackStart() must come before viteReact().
    tanstackStart(),
    nitro(),
    viteReact(),
    tailwindcss(),
  ],
});
