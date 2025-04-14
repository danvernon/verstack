import {
  companies,
  companyLocations,
  companyMembers,
  companyOffices,
  companyRequisitionReasons,
  companyWorkerSubTypes,
  companyWorkerTypes,
  ROLE_VALUES,
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

        const defaultWorkerTypes = [
          "Employee",
          "Contractor",
          "Intern",
          "Consultant",
        ];

        await tx.insert(companyWorkerTypes).values(
          defaultWorkerTypes.map((name) => ({
            companyId: company[0].id,
            name,
          })),
        );

        const defaultWorkerSubTypes = [
          "Full Time",
          "Part Time",
          "Temporary",
          "Contract",
        ];

        await tx.insert(companyWorkerSubTypes).values(
          defaultWorkerSubTypes.map((name) => ({
            companyId: company[0].id,
            name,
          })),
        );

        const defaultRequisitionReasons = [
          "Backfill",
          "New Position",
          "Replacement",
          "Reorganisation",
          "Growth",
        ];

        await tx.insert(companyRequisitionReasons).values(
          defaultRequisitionReasons.map((name) => ({
            companyId: company[0].id,
            name,
          })),
        );

        const defaultLocations = ["Remote", "Onsite", "Hybrid"];

        await tx.insert(companyLocations).values(
          defaultLocations.map((name) => ({
            companyId: company[0].id,
            name,
          })),
        );

        const defaultOffices = ["London"];

        await tx.insert(companyOffices).values(
          defaultOffices.map((name) => ({
            companyId: company[0].id,
            name,
          })),
        );

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
  getConfigurations: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({
        where: eq(users.id, ctx.auth.userId),
      });

      if (!user?.companyId) {
        throw new Error("User does not belong to a company");
      }

      const company = await tx.query.companies.findFirst({
        where: eq(companies.id, user.companyId),
        with: {
          locations: true,
          requisitionReasons: true,
          workerTypes: true,
          workerSubTypes: true,
          offices: true,
        },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      return company;
    });
  }),
  updateConfigurations: protectedProcedure
    .input(
      z.object({
        locations: z
          .array(
            z.object({
              value: z.string(),
            }),
          )
          .optional(),
        requisitionReasons: z
          .array(
            z.object({
              value: z.string(),
            }),
          )
          .optional(),
        workerTypes: z
          .array(
            z.object({
              value: z.string(),
            }),
          )
          .optional(),
        workerSubTypes: z
          .array(
            z.object({
              value: z.string(),
            }),
          )
          .optional(),
        officeLocations: z
          .array(
            z.object({
              value: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.id, ctx.auth.userId),
        });

        if (!user?.companyId) {
          throw new Error("User does not belong to a company");
        }

        const company = await tx.query.companies.findFirst({
          where: eq(companies.id, user.companyId),
        });

        if (!company) {
          throw new Error("Company not found");
        }

        if (input.locations) {
          const existingLocations = await tx.query.companyLocations.findMany({
            where: eq(companyLocations.companyId, company.id),
          });

          const {
            itemsToAdd: locationsToAdd,
            itemsToDelete: locationIdsToDelete,
          } = analyzeConfigItems(existingLocations, input.locations);

          if (locationsToAdd.length > 0) {
            await tx.insert(companyLocations).values(
              locationsToAdd.map((name) => ({
                name,
                companyId: company.id,
              })),
            );
          }

          for (const id of locationIdsToDelete) {
            await tx
              .update(companyLocations)
              .set({ isActive: false, deletedAt: new Date() })
              .where(eq(companyLocations.id, id));
          }
        }

        if (input.requisitionReasons) {
          const existingReasons =
            await tx.query.companyRequisitionReasons.findMany({
              where: eq(companyRequisitionReasons.companyId, company.id),
            });

          const { itemsToAdd: reasonsToAdd, itemsToDelete: reasonIdsToDelete } =
            analyzeConfigItems(existingReasons, input.requisitionReasons);

          if (reasonsToAdd.length > 0) {
            await tx.insert(companyRequisitionReasons).values(
              reasonsToAdd.map((name) => ({
                name,
                companyId: company.id,
              })),
            );
          }

          for (const id of reasonIdsToDelete) {
            await tx
              .update(companyRequisitionReasons)
              .set({ isActive: false, deletedAt: new Date() })
              .where(eq(companyRequisitionReasons.id, id));
          }
        }

        if (input.workerTypes) {
          const existingWorkerTypes =
            await tx.query.companyWorkerTypes.findMany({
              where: eq(companyWorkerTypes.companyId, company.id),
            });

          const {
            itemsToAdd: workerTypesToAdd,
            itemsToDelete: workerTypeIdsToDelete,
          } = analyzeConfigItems(existingWorkerTypes, input.workerTypes);

          if (workerTypesToAdd.length > 0) {
            await tx.insert(companyWorkerTypes).values(
              workerTypesToAdd.map((name) => ({
                name,
                companyId: company.id,
              })),
            );
          }

          for (const id of workerTypeIdsToDelete) {
            await tx
              .update(companyWorkerTypes)
              .set({ isActive: false, deletedAt: new Date() })
              .where(eq(companyWorkerTypes.id, id));
          }
        }

        if (input.workerSubTypes) {
          const existingWorkerSubTypes =
            await tx.query.companyWorkerSubTypes.findMany({
              where: eq(companyWorkerSubTypes.companyId, company.id),
            });

          const {
            itemsToAdd: workerSubTypesToAdd,
            itemsToDelete: workerSubTypeIdsToDelete,
          } = analyzeConfigItems(existingWorkerSubTypes, input.workerSubTypes);

          if (workerSubTypesToAdd.length > 0) {
            await tx.insert(companyWorkerSubTypes).values(
              workerSubTypesToAdd.map((name) => ({
                name,
                companyId: company.id,
              })),
            );
          }

          for (const id of workerSubTypeIdsToDelete) {
            await tx
              .update(companyWorkerSubTypes)
              .set({ isActive: false, deletedAt: new Date() })
              .where(eq(companyWorkerSubTypes.id, id));
          }
        }

        if (input.officeLocations) {
          const existing = await tx.query.companyOffices.findMany({
            where: eq(companyOffices.companyId, company.id),
          });

          const { itemsToAdd, itemsToDelete } = analyzeConfigItems(
            existing,
            input.officeLocations,
          );

          if (itemsToAdd.length > 0) {
            await tx.insert(companyOffices).values(
              itemsToAdd.map((name) => ({
                name,
                companyId: company.id,
              })),
            );
          }

          for (const id of itemsToDelete) {
            await tx
              .update(companyOffices)
              .set({ isActive: false, deletedAt: new Date() })
              .where(eq(companyOffices.id, id));
          }
        }

        return { success: true };
      });
    }),
});

/**
 * Analyzes configuration items and determines which ones need to be added or deleted
 * @returns An object with items to add and IDs to delete
 */
function analyzeConfigItems(
  existingItems: Array<{ id: string; name: string; isActive: boolean }>,
  newItems: Array<{ value: string }>,
) {
  // Identify items to add (those not found in existing items)
  const itemsToAdd = newItems
    .map((item) => item.value)
    .filter(
      (value) => !existingItems.some((existing) => existing.name === value),
    );

  // Identify items to delete (existing active items not in the new list)
  const valuesToKeep = newItems.map((item) => item.value);

  const itemsToDelete = existingItems
    .filter(
      (existing) => existing.isActive && !valuesToKeep.includes(existing.name),
    )
    .map((item) => item.id);

  return {
    itemsToAdd,
    itemsToDelete,
  };
}
