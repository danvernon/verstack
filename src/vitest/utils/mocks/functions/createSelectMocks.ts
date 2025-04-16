import type { Mock } from "vitest";
import { vi } from "vitest";

/**
 * Interface for select operation mocks
 */
export interface SelectMocks {
  select: Mock;
  from: Mock;
  where: Mock;
  orderBy: Mock;
  limit: Mock;
  execute: Mock;
}

/**
 * Creates mock functions for testing select operations
 * with the proper chain: select() → from() → where() → orderBy() → limit() → execute()
 */
export function createSelectMocks<T = unknown>(
  returnValue: T[] = [],
): SelectMocks {
  const execute = vi.fn().mockResolvedValue(returnValue);
  const limit = vi.fn().mockReturnValue({ execute });
  const orderBy = vi.fn().mockReturnValue({ limit, execute });
  const where = vi.fn().mockReturnValue({ orderBy, limit, execute });
  const from = vi.fn().mockReturnValue({ where, orderBy, limit, execute });
  const select = vi.fn().mockReturnValue({ from });

  return { select, from, where, orderBy, limit, execute };
}
