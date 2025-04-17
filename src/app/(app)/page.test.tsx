import type { Mock } from "vitest";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import Home from "./page";

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
