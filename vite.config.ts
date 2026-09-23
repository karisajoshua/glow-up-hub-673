// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

// Load unprefixed env vars into process.env for server-side code only.
// These are NOT injected into the client bundle.
const serverEnv = loadEnv(process.env["NODE_ENV"] ?? "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

// Publishable (non-secret) backend connection settings. These are safe to ship to the
// browser and act as a fallback when the build environment does not expose VITE_* vars,
// which would otherwise leave the deployed bundle without a backend connection.
const PUBLIC_SUPABASE = {
  VITE_SUPABASE_URL: "https://rvemzcjfcrrqxizxfhce.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_8bGFdMBmH1IY4eoYvfLG1g_DDcIbiis",
  VITE_SUPABASE_PROJECT_ID: "rvemzcjfcrrqxizxfhce",
} as const;

const publicDefine = Object.fromEntries(
  Object.entries(PUBLIC_SUPABASE).map(([key, fallback]) => [
    `import.meta.env.${key}`,
    JSON.stringify(process.env[key] || fallback),
  ]),
);

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        "entities/lib/decode.js": path.resolve(
          import.meta.dirname,
          "node_modules/entities/lib/decode.js",
        ),
        "entities/lib/encode.js": path.resolve(
          import.meta.dirname,
          "node_modules/entities/lib/encode.js",
        ),
        entities: path.resolve(import.meta.dirname, "node_modules/entities"),
      },
    },
  },
});
