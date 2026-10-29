
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "node-server",
  } as Record<string, unknown>,
  tanstackStart: {
    server: { entry: "server" },
  },
});
