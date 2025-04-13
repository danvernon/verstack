import type * as schema from "@/server/db/schema";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { type Sql } from "postgres";
import { vi } from "vitest";

export const createMockDb = (overrides = {}) =>
  ({
    query: {
      users: {
        findFirst: vi.fn(),
        // ...add other queries/methods
      },
      // ...other tables
    },
    ...overrides,
  }) as unknown as PostgresJsDatabase<typeof schema> & {
    $client: Sql<Record<string, unknown>>;
  };
