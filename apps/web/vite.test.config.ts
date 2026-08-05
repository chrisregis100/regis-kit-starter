import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: {
    watch: null,
  },
  plugins: [nitro()],
});
