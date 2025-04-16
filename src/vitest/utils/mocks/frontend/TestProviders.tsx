import React, { createContext } from "react";
import { type NextRouter } from "next/router";

import { createMockRouter } from "./createMockRouter";

// Create our own RouterContext instead of importing from Next.js internals
export const RouterContext = createContext<NextRouter>({} as NextRouter);

interface TestProvidersProps {
  children: React.ReactNode;
  router?: Partial<NextRouter>;
}

/**
 * Provider component for wrapping components in tests
 * This provides common context providers needed for testing components
 *
 * @param props Component props
 * @returns A wrapped component with all required providers
 */
export function TestProviders({ children, router = {} }: TestProvidersProps) {
  const mockRouter = createMockRouter(router);

  return (
    <RouterContext.Provider value={mockRouter}>
      {children}
    </RouterContext.Provider>
  );
}

/**
 * Utility function to wrap a component with all necessary providers for testing
 *
 * @param ui Component to wrap
 * @param router Router mock options
 * @returns Wrapped component
 */
export function withTestProviders(
  ui: React.ReactElement,
  router: Partial<NextRouter> = {},
) {
  return <TestProviders router={router}>{ui}</TestProviders>;
}
