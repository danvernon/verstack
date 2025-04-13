// createTestContext.ts
import type { createTRPCContext } from "@/server/api/trpc";
import type * as schema from "@/server/db/schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Sql } from "postgres";
import { vi } from "vitest";

type TestContext = Awaited<ReturnType<typeof createTRPCContext>>;

// Create a more complete mock of the users query builder
const createMockUsersQueryBuilder = (overrides = {}) => {
  const defaultMethods = {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    get fields() {
      return {};
    },
    get selection() {
      return {};
    },
    get fullSchema() {
      return {};
    },
    get schema() {
      return {};
    },
    get tableNamesMap() {
      return {};
    },
    get table() {
      return {};
    },
    // Add all other methods that the query builder has
    // You might need to add more based on what you're using
  };

  return {
    ...defaultMethods,
    ...overrides,
  };
};

/**
 * Mock implementation of Drizzle ORM for testing
 */
export const createMockDb = (dbOverrides = {}) => {
  const defaultDb = {
    query: {
      users: createMockUsersQueryBuilder(),
    },
    $client: {} as Sql<{}>,
    $transaction: vi.fn(),
    $executeRaw: vi.fn(),
    $queryRaw: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    _: undefined,
    with: vi.fn(),
    $with: vi.fn(),
    $count: vi.fn(),
  };

  // Merge overrides
  const mergedDb = {
    ...defaultDb,
    ...dbOverrides,
  };

  // Handle query overrides specifically
  if (dbOverrides.query) {
    mergedDb.query = { ...defaultDb.query };

    // Handle each table's query builder overrides
    Object.entries(dbOverrides.query).forEach(([tableName, tableOverrides]) => {
      if (tableName === "users") {
        mergedDb.query.users = createMockUsersQueryBuilder(tableOverrides);
      }
      // Add other tables as needed
    });
  }

  return mergedDb as unknown as PostgresJsDatabase<typeof schema> & {
    $client: Sql<{}>;
  };
};

/**
 * Create a mock tRPC context for unit testing
 */
export const createTestContext = (
  contextOverrides: Partial<TestContext> = {},
  dbOverrides = {},
): TestContext => {
  return {
    db: createMockDb(dbOverrides),
    auth: {
      userId: "user_123",
      sessionId: "sess_abc",
      getToken: async () => "mock-token",
    },
    headers: new Headers(),
    ...contextOverrides,
  } as TestContext;
};
