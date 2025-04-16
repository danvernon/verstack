import type { Mock } from "vitest";
import { vi } from "vitest";

/**
 * Interface for delete operation mocks
 */
export interface DeleteMocks {
  delete: Mock;
  where: Mock;
  returning: Mock;
}

/**
 * Creates mock functions for testing delete operations
 * with the proper chain: delete() → where() → returning()
 */
export function createDeleteMocks<T = unknown>(
  returnValue: T[] = [],
): DeleteMocks {
  const returning = vi.fn().mockResolvedValue(returnValue);
  const where = vi.fn().mockReturnValue({ returning });
  const deleteFunc = vi.fn().mockReturnValue({ where, returning });

  return { delete: deleteFunc, where, returning };
}
