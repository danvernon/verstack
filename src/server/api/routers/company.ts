import { companies, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const companyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const company = await tx
          .insert(companies)
          .values({
            name: input.name,
            creatorId: ctx.auth.userId,
          })
          .returning();

        if (!company[0]) {
          throw new Error("Company creation failed");
        }

        await tx
          .update(users)
          .set({
            companyId: company[0].id,
          })
          .where(eq(users.id, ctx.auth.userId));

        return company[0];
      });
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.companies.findFirst({
      where: eq(companies.creatorId, ctx.auth.userId),
    });

    return res;
  }),
});
