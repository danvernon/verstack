import { vi } from "vitest";

// Mock server-only package
vi.mock("server-only", () => {
  return {};
});

// Mock Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  auth: () => ({
    userId: "test-user-id",
    sessionId: "test-session-id",
    getToken: async () => "mock-token",
  }),
}));
