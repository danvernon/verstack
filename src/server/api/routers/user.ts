import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.auth.userId),
    });

    return user;
  }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db
      .insert(users)
      .values({
        id: ctx.auth.userId,
      })
      .onConflictDoNothing()
      .returning();

    return user[0] ?? null;
  }),
});
