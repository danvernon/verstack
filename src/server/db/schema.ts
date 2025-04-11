import { InferSelectModel, relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTable } from "drizzle-orm/pg-core";

export const companies = pgTable(
  "company",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    name: d.varchar({ length: 256 }).notNull(),
    logo: d.varchar({ length: 512 }),
    creatorId: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("company_name_idx").on(t.name),
    index("company_creator_id_idx").on(t.creatorId),
  ],
);

export const users = pgTable(
  "user",
  (d) => ({
    id: d.varchar({ length: 256 }).primaryKey(),
    companyId: d.uuid().references(() => companies.id),
  }),
  (t) => [index("user_company_id_idx").on(t.companyId)],
);

export const posts = pgTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const workerTypeEnum = pgEnum("worker_type", [
  "EMPLOYEE",
  "CONTRACTOR",
  "INTERN",
  "CONSULTANT",
]);

export const workerSubTypeEnum = pgEnum("worker_sub_type", [
  "FULL_TIME",
  "PART_TIME",
  "TEMPORARY",
  "SEASONAL",
]);

export const requisitionReasonEnum = pgEnum("requisition_reason", [
  "BACKFILL",
  "NEW_POSITION",
  "REPLACEMENT",
  "REORGANIZATION",
  "GROWTH",
]);

export const locationEnum = pgEnum("location", ["REMOTE", "ONSITE", "HYBRID"]);

export const requisitions = pgTable(
  "requisition",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    companyId: d.uuid().references(() => companies.id),
    userId: d
      .varchar({ length: 256 })
      .notNull()
      .references(() => users.id),
    title: d.varchar({ length: 256 }).notNull(),
    level: d.varchar({ length: 256 }).notNull(),
    type: workerTypeEnum().notNull(),
    subType: workerSubTypeEnum().notNull(),
    reason: requisitionReasonEnum().notNull(),
    location: locationEnum().notNull(),
    description: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("requisition_company_id_idx").on(t.companyId),
    index("requisition_user_id_idx").on(t.userId),
  ],
);

export type Requisition = InferSelectModel<typeof requisitions>;

export const requisitionRelations = relations(requisitions, ({ one }) => ({
  company: one(companies, {
    fields: [requisitions.companyId],
    references: [companies.id],
  }),
}));
