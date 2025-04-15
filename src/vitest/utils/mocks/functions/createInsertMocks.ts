import type { Mock } from "vitest";
import { vi } from "vitest";

interface InsertMocks {
  insert: Mock;
  values: Mock;
  onConflictDoNothing: Mock;
  returning: Mock;
}

/**
 * Creates mock functions for testing insert operations
 * with the proper chain: insert() → values() → onConflictDoNothing() → returning()
 */
export function createInsertMocks<T = unknown>(
  returnValue: T[] = [],
): InsertMocks {
  const returning = vi.fn().mockResolvedValue(returnValue);
  const onConflictDoNothing = vi.fn().mockReturnValue({ returning });
  const values = vi.fn().mockReturnValue({ onConflictDoNothing, returning });
  const insert = vi
    .fn()
    .mockReturnValue({ values, onConflictDoNothing, returning });

  return { insert, values, onConflictDoNothing, returning };
}
