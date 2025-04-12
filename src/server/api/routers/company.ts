import {
  companies,
  companyLocations,
  companyMembers,
  companyRequisitionReasons,
  companyWorkerSubTypes,
  companyWorkerTypes,
  ROLE_VALUES,
  roleEnum,
  users,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const companyRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.companies.findFirst({
      where: eq(companies.creatorId, ctx.auth.userId),
    });

    return res;
  }),
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

        await tx.insert(companyMembers).values({
          companyId: company[0].id,
          userId: ctx.auth.userId,
          role: ROLE_VALUES[0],
        });

        await tx.insert(companyWorkerTypes).values([
          {
            companyId: company[0].id,
            name: "Employee",
          },
          {
            companyId: company[0].id,
            name: "Contractor",
          },
          {
            companyId: company[0].id,
            name: "Intern",
          },
          {
            companyId: company[0].id,
            name: "Consultant",
          },
        ]);

        await tx.insert(companyWorkerSubTypes).values([
          {
            companyId: company[0].id,
            name: "Full Time",
          },
          {
            companyId: company[0].id,
            name: "Part Time",
          },
          {
            companyId: company[0].id,
            name: "Temporary",
          },
          {
            companyId: company[0].id,
            name: "Contract",
          },
        ]);

        await tx.insert(companyRequisitionReasons).values([
          {
            companyId: company[0].id,
            name: "Backfill",
          },
          {
            companyId: company[0].id,
            name: "New Position",
          },
          {
            companyId: company[0].id,
            name: "Replacement",
          },
          {
            companyId: company[0].id,
            name: "Reorganisation",
          },
          {
            companyId: company[0].id,
            name: "Growth",
          },
        ]);

        await tx.insert(companyLocations).values([
          {
            companyId: company[0].id,
            name: "Remote",
          },
          {
            companyId: company[0].id,
            name: "Onsite",
          },
          {
            companyId: company[0].id,
            name: "Hybrid",
          },
        ]);

        await tx
          .update(users)
          .set({
            companyId: company[0].id,
          })
          .where(eq(users.id, ctx.auth.userId));

        return company[0];
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        logo: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .update(companies)
        .set({
          name: input.name,
          logo: input.logo,
        })
        .where(eq(companies.creatorId, ctx.auth.userId))
        .returning();

      return res[0];
    }),
});
