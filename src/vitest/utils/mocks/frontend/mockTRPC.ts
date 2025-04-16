import type { Mock } from "vitest";
import { type api } from "@/trpc/react";
import { vi } from "vitest";

/**
 * Type to help with mocking tRPC hooks
 */
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Mocks the tRPC hooks for testing
 * This allows for easy mocking of tRPC calls in components
 */
export function mockTRPCHooks(mockImplementation: DeepPartial<typeof api>) {
  const mockApi = {} as typeof api;

  if (mockImplementation.company) {
    mockApi.company =
      mockImplementation.company as unknown as typeof api.company;
  }

  if (mockImplementation.user) {
    mockApi.user = mockImplementation.user as unknown as typeof api.user;
  }

  // Add more specific routers as needed in your application
  // Example:
  // if (mockImplementation.auth) {
  //   mockApi.auth = mockImplementation.auth as unknown as typeof api.auth;
  // }

  if (mockImplementation.useUtils) {
    mockApi.useUtils = vi
      .fn()
      .mockReturnValue(
        mockImplementation.useUtils as unknown as ReturnType<
          typeof api.useUtils
        >,
      );
  }

  vi.mock("@/trpc/react", () => ({
    api: mockApi,
  }));

  return mockApi;
}

/**
 * Creates a mock tRPC mutation hook
 */
export function createMockMutation<TData = unknown, TError = Error>(
  config: {
    mutateAsync?: Mock;
    mutate?: Mock;
    data?: TData;
    error?: TError;
    isPending?: boolean;
    isError?: boolean;
    isSuccess?: boolean;
    reset?: Mock;
  } = {},
) {
  return {
    mutateAsync:
      config.mutateAsync ?? vi.fn().mockResolvedValue(config.data ?? null),
    mutate: config.mutate ?? vi.fn(),
    data: config.data ?? null,
    error: config.error ?? null,
    isPending: config.isPending ?? false,
    isError: config.isError ?? false,
    isSuccess: config.isSuccess ?? false,
    reset: config.reset ?? vi.fn(),
  } as const;
}

/**
 * Creates a mock tRPC query hook
 */
export function createMockQuery<TData = unknown, TError = Error>(
  config: {
    data?: TData;
    error?: TError;
    isLoading?: boolean;
    isFetching?: boolean;
    isError?: boolean;
    isSuccess?: boolean;
    refetch?: Mock;
  } = {},
) {
  return {
    data: config.data ?? null,
    error: config.error ?? null,
    isLoading: config.isLoading ?? false,
    isFetching: config.isFetching ?? false,
    isError: config.isError ?? false,
    isSuccess: config.isSuccess ?? true,
    refetch:
      config.refetch ??
      vi.fn().mockResolvedValue({ data: config.data ?? null }),
  } as const;
}
