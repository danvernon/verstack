import { type NextRouter } from "next/router";
import { vi } from "vitest";

/**
 * Creates a mock Next.js router for testing components that use router hooks
 *
 * @param router Partial router object to override default mock properties
 * @returns A mock NextRouter object
 */
export function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
    back: vi.fn(),
    beforePopState: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn().mockResolvedValue(undefined),
    push: vi.fn().mockResolvedValue(true),
    reload: vi.fn(),
    replace: vi.fn().mockResolvedValue(true),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    ...router,
  };
}
