import { defineConfig } from "@tanstack/start/config";
import tailwindcss from "@tailwindcss/vite";

// PORT and HOST are read from environment variables by Nitro at runtime.
// For Render.com: set PORT=$PORT and HOST=0.0.0.0 in the dashboard.
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
