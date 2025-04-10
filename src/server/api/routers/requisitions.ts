import {
  locationEnum,
  requisitionReasonEnum,
  users,
  workerSubTypeEnum,
  workerTypeEnum,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { requisitions } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const requisitionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        level: z.string(),
        type: z.enum(workerTypeEnum.enumValues),
        subType: z.enum(workerSubTypeEnum.enumValues),
        reason: z.enum(requisitionReasonEnum.enumValues),
        location: z.enum(locationEnum.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.id, ctx.auth.userId),
        });

        if (!user) {
          throw new Error("User not found");
        }
        const newReq = await tx
          .insert(requisitions)
          .values({
            userId: ctx.auth.userId,
            companyId: user.companyId,
            ...input,
          })
          .returning();

        return newReq[0];
      });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.requisitions.findMany({
      where: eq(requisitions.userId, ctx.auth.userId),
    });

    return res;
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.query.requisitions.findFirst({
        where: eq(requisitions.id, input.id),
      });

      return res;
    }),
  updateDescription: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .update(requisitions)
        .set({
          description: input.description,
        })
        .where(eq(requisitions.id, input.id))
        .returning();

      return res[0];
    }),
});
