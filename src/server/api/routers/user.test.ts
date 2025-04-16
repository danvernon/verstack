import { type User } from "@/server/db/schema";
import { createTestContext } from "@/vitest/utils/createTestContext";
import { createMockUser } from "@/vitest/utils/mocks/data/createMockUser";
import { createInsertMocks } from "@/vitest/utils/mocks/functions/createInsertMocks";
import { describe, expect, it, vi } from "vitest";

import { userRouter } from "./user";

describe("userRouter", () => {
  it("should return user by ID", async () => {
    const mockUser: User = { id: "123", companyId: "123" };

    const ctx = createTestContext(
      {},
      {
        query: {
          users: {
            findFirst: vi.fn().mockResolvedValue(mockUser),
          },
        },
      },
    );

    const caller = userRouter.createCaller(ctx);
    const result = await caller.getUser();

    expect(result).toEqual(mockUser);
  });

  it("should return null if user not found", async () => {
    const ctx = createTestContext(
      {},
      {
        query: {
          users: {
            findFirst: vi.fn().mockResolvedValue(null),
          },
        },
      },
    );

    const caller = userRouter.createCaller(ctx);
    const result = await caller.getUser();

    expect(result).toBeNull();
  });

  it("should create a new user", async () => {
    const mockUser = createMockUser();
    const mocks = createInsertMocks([mockUser]);

    const ctx = createTestContext(
      {},
      {
        insert: mocks.insert,
      },
    );

    const caller = userRouter.createCaller(ctx);
    const result = await caller.create();

    expect(result).toEqual(mockUser);
    expect(mocks.insert).toHaveBeenCalled();
    expect(mocks.values).toHaveBeenCalledWith({
      id: "user_123",
    });
  });

  it("should return null if insert doesn't return a user", async () => {
    const mocks = createInsertMocks();

    const ctx = createTestContext(
      {},
      {
        insert: mocks.insert,
      },
    );

    const caller = userRouter.createCaller(ctx);
    const result = await caller.create();

    expect(result).toBeNull();
  });
});
