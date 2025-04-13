import { users } from "@/server/db/schema";
import { eq, max } from "drizzle-orm";
import { z } from "zod";

import { requisitions } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const requisitionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        level: z.string(),
        typeId: z.string(),
        subTypeId: z.string(),
        reasonId: z.string(),
        locationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.id, ctx.auth.userId),
        });

        if (!user?.companyId) {
          throw new Error("User does not belong to a company");
        }

        const result = await tx
          .select({
            maxReqNum: max(requisitions.requisitionNumber),
          })
          .from(requisitions)
          .where(eq(requisitions.companyId, user.companyId));

        let nextReqNumber = 1;
        if (result[0]?.maxReqNum) {
          const currentMax = parseInt(result[0].maxReqNum, 10);
          if (!isNaN(currentMax)) {
            nextReqNumber = currentMax + 1;
          }
        }

        const formattedReqNumber = nextReqNumber.toString().padStart(5, "0");

        const newReq = await tx
          .insert(requisitions)
          .values({
            userId: ctx.auth.userId,
            companyId: user.companyId,
            requisitionNumber: formattedReqNumber,
            status: "DRAFT",
            ...input,
          })
          .returning();

        if (!newReq) {
          throw new Error("Failed to create requisition");
        }

        return newReq[0];
      });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.requisitions.findMany({
      where: eq(requisitions.userId, ctx.auth.userId),
      with: {
        workerType: true,
        location: true,
      },
    });

    return res;
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.query.requisitions.findFirst({
        where: eq(requisitions.id, input.id),
        with: {
          workerType: true,
          workerSubType: true,
          reason: true,
          location: true,
        },
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
