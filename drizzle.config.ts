import { env } from "@/env";
import { type Config } from "drizzle-kit";

import "dotenv/config";

import { defineConfig } from "drizzle-kit";

// export default {
//   schema: "./src/server/db/schema.ts",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: env.DATABASE_URL,
//   },
// } satisfies Config;

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
