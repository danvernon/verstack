// src/vitest/setup-react.ts
import NextImage from "next/image";
import { vi } from "vitest";

// Add React to the global scope for tests (needed for Next.js App Router components)
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    // Add any specific React mock overrides here if needed
  };
});

// Mock common Next.js components and utilities
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
}));

// Mock Next.js image component
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...rest
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    const Image = NextImage;
    return <Image src={src} alt={alt} {...rest} />;
  },
}));
