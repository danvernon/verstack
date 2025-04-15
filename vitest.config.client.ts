import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// For client tests
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/server/**/*.test.{ts,tsx}", // Exclude server tests
      "**/server/**/*.spec.{ts,tsx}",
    ],
  },
});
