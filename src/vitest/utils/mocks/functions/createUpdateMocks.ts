import type { Mock } from "vitest";
import { vi } from "vitest";

/**
 * Interface for update operation mocks
 */
export interface UpdateMocks {
  update: Mock;
  set: Mock;
  where: Mock;
  returning: Mock;
}

/**
 * Creates mock functions for testing update operations
 * with the proper chain: update() → set() → where() → returning()
 */
export function createUpdateMocks<T = unknown>(
  returnValue: T[] = [],
): UpdateMocks {
  const returning = vi.fn().mockResolvedValue(returnValue);
  const where = vi.fn().mockReturnValue({ returning });
  const set = vi.fn().mockReturnValue({ where, returning });
  const update = vi.fn().mockReturnValue({ set });

  return { update, set, where, returning };
}
