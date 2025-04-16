import type { Mock } from "vitest";
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import Home from "./page";

// Mock React since Next.js App Router components use JSX without explicit imports
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
  };
});

vi.mock("@/trpc/server", () => ({
  api: {
    user: {
      getUser: vi.fn(),
      create: vi.fn(),
    },
    company: {
      get: vi.fn(),
    },
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock any components imported by the page
vi.mock("@/components/dashboard", () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard Component</div>,
}));

vi.mock("@/components/company/create-company", () => ({
  default: () => (
    <div data-testid="create-company">Create Company Component</div>
  ),
}));

describe("Home", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /sign-in if userId is not present", async () => {
    (auth as unknown as Mock).mockResolvedValue({ userId: null });

    await Home();

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });
});
