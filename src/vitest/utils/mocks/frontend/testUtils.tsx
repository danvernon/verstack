// Set up testing environment for all tests
import "@testing-library/vi-dom";

import { vi } from "vitest";

// Silence Next.js router warnings
// This is needed since we're mocking the router
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Not implemented: navigation") ||
      args[0].includes("Error: Attempted to hard navigate"))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn().mockReturnValue("/"),
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
  useParams: vi.fn().mockReturnValue({}),
}));

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & {
      src: string;
      alt: string;
      width?: number;
      height?: number;
      priority?: boolean;
    },
  ) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src} alt={props.alt} />;
  },
}));
