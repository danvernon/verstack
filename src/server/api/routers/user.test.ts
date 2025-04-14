import { type User } from "@/server/db/schema";
import { createTestContext } from "@/vitest/utils/createTestContext";
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

  // it("should create a new user", async () => {
  //   const mockUser = { id: "user_123" };

  //   const ctx = createTestContext({
  //     db: {
  //       insert: vi.fn().mockReturnThis(),
  //       values: vi.fn().mockReturnThis(),
  //       onConflictDoNothing: vi.fn().mockReturnThis(),
  //       returning: vi.fn().mockResolvedValue([mockUser]),
  //     },
  //   });

  //   const caller = userRouter.createCaller(ctx);
  //   const result = await caller.create();

  //   expect(result).toEqual(mockUser);

  //   expect(ctx.db.insert).toHaveBeenCalled();

  //   expect(ctx.db.values).toHaveBeenCalledWith({
  //     id: "user_123",
  //   });
  // });

  // it("should return null if insert doesn't return a user", async () => {
  //   const ctx = createTestContext({
  //     db: {
  //       insert: vi.fn().mockReturnThis(),
  //       values: vi.fn().mockReturnThis(),
  //       onConflictDoNothing: vi.fn().mockReturnThis(),
  //       returning: vi.fn().mockResolvedValue([]),
  //     },
  //   });

  //   const caller = userRouter.createCaller(ctx);
  //   const result = await caller.create();

  //   expect(result).toBeNull();
  // });
});
