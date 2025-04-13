import "@testing-library/react";
import "@testing-library/jest-dom";

import React from "react";
import { cleanup } from "@testing-library/react";
import { beforeEach, vi } from "vitest";

beforeEach(() => {
  cleanup();
});

global.React = React;

if (typeof window === "undefined") {
  global.window = globalThis.window || Object.create(null);
}

global.window.matchMedia = function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
};

vi.mock("next/navigation", () => ({
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: vi.fn(() => "/mock-path"),
  useParams: vi.fn(() => ({ id: "mock-id" })),
}));
