import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    environmentMatchGlobs: [
      // For React component tests, use jsdom
      ["**/*.{test,spec}.tsx", "jsdom"],
    ],
    include: ["**/*.test.tsx"],
    setupFiles: "./src/vitest/setup.ts",
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [tsconfigPaths()],
});
