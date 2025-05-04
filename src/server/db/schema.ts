import type { InferSelectModel } from "drizzle-orm";
import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTable, uniqueIndex } from "drizzle-orm/pg-core";

export const companies = pgTable(
  "company",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    name: d.varchar({ length: 256 }).notNull(),
    logo: d.varchar({ length: 512 }),
    creatorId: d.varchar({ length: 256 }).notNull(),
    deletedAt: d.timestamp({ withTimezone: true }),
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

export type Company = InferSelectModel<typeof companies>;

export const companyRelations = relations(companies, ({ many }) => ({
  members: many(companyMembers),
  requisitions: many(requisitions),
  workerTypes: many(companyWorkerTypes),
  workerSubTypes: many(companyWorkerSubTypes),
  requisitionReasons: many(companyRequisitionReasons),
  locations: many(companyLocations),
  offices: many(companyOffices),
  jobLevels: many(jobLevels),
}));

export const users = pgTable(
  "user",
  (d) => ({
    id: d.varchar({ length: 256 }).primaryKey(),
    companyId: d
      .uuid()
      .references(() => companies.id, { onDelete: "set null" }),
  }),
  (t) => [index("user_company_id_idx").on(t.companyId)],
);

export type User = InferSelectModel<typeof users>;

export const ROLE_VALUES = [
  "OWNER",
  "ADMIN",
  "APPROVER",
  "MEMBER",
] as const satisfies readonly [string, ...string[]];

export const roleEnum = pgEnum("member_role", ROLE_VALUES);

export const companyMembers = pgTable(
  "company_member",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    userId: d
      .varchar({ length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyId: d
      .uuid()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    role: roleEnum("MEMBER").notNull(),
    deletedAt: d.timestamp({ withTimezone: true }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("company_member_user_id_idx").on(t.userId),
    index("company_member_company_id_idx").on(t.companyId),
    uniqueIndex("company_member_user_company_unique_idx").on(
      t.userId,
      t.companyId,
    ),
  ],
);

export const INVITATION_STATUS_VALUES = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
] as const satisfies readonly [string, ...string[]];

export const invitationStatusEnum = pgEnum(
  "invitation_status",
  INVITATION_STATUS_VALUES,
);

export const invitations = pgTable(
  "invitation",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    email: d.varchar({ length: 256 }).notNull(),
    companyId: d
      .uuid()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    invitedById: d
      .varchar({ length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: d.varchar({ length: 256 }).notNull().unique(),
    expiresAt: d.timestamp({ withTimezone: true }).notNull(),
    status: invitationStatusEnum("PENDING").notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("invitation_email_idx").on(t.email),
    index("invitation_company_id_idx").on(t.companyId),
    index("invitation_token_idx").on(t.token),
  ],
);

export const auditLogs = pgTable(
  "audit_log",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    entityType: d.varchar({ length: 100 }).notNull(),
    entityId: d.uuid().notNull(),
    userId: d
      .varchar({ length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    action: d.varchar({ length: 100 }).notNull(),
    changes: d.jsonb(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("audit_log_entity_type_idx").on(t.entityType),
    index("audit_log_entity_id_idx").on(t.entityId),
    index("audit_log_user_id_idx").on(t.userId),
  ],
);

export const REQUISITION_STATUS_VALUES = [
  "DRAFT",
  "APPROVED",
  "PUBLISHED",
  "CLOSED",
] as const satisfies readonly [string, ...string[]];

export const requisitionStatusEnum = pgEnum(
  "requisition_status",
  REQUISITION_STATUS_VALUES,
);

export const requisitions = pgTable(
  "requisition",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    companyId: d.uuid().references(() => companies.id, { onDelete: "cascade" }),
    userId: d
      .varchar({ length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    requisitionNumber: d.varchar({ length: 20 }).notNull(),
    title: d.varchar({ length: 256 }).notNull(),
    levelId: d
      .uuid()
      .notNull()
      .references(() => jobLevels.id, { onDelete: "restrict" }),
    typeId: d
      .uuid()
      .notNull()
      .references(() => companyWorkerTypes.id, { onDelete: "restrict" }),
    subTypeId: d
      .uuid()
      .notNull()
      .references(() => companyWorkerSubTypes.id, { onDelete: "restrict" }),
    reasonId: d
      .uuid()
      .notNull()
      .references(() => companyRequisitionReasons.id, { onDelete: "restrict" }),
    locationId: d
      .uuid()
      .notNull()
      .references(() => companyLocations.id, { onDelete: "restrict" }),
    officeId: d
      .uuid()
      .notNull()
      .references(() => companyOffices.id, { onDelete: "restrict" }),
    description: d.text(),
    status: requisitionStatusEnum("DRAFT").notNull(),
    deletedAt: d.timestamp({ withTimezone: true }),
    version: d.integer().default(1).notNull(),
    changeHistory: d.jsonb().default([]),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("requisition_company_id_idx").on(t.companyId),
    index("requisition_user_id_idx").on(t.userId),
    index("requisition_status_idx").on(t.status),
    index("requisition_deleted_at_idx").on(t.deletedAt),
  ],
);

export type Requisition = InferSelectModel<typeof requisitions>;

export const requisitionRelations = relations(requisitions, ({ one }) => ({
  company: one(companies, {
    fields: [requisitions.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [requisitions.userId],
    references: [users.id],
  }),
  workerType: one(companyWorkerTypes, {
    fields: [requisitions.typeId],
    references: [companyWorkerTypes.id],
  }),
  workerSubType: one(companyWorkerSubTypes, {
    fields: [requisitions.subTypeId],
    references: [companyWorkerSubTypes.id],
  }),
  reason: one(companyRequisitionReasons, {
    fields: [requisitions.reasonId],
    references: [companyRequisitionReasons.id],
  }),
  location: one(companyLocations, {
    fields: [requisitions.locationId],
    references: [companyLocations.id],
  }),
  office: one(companyOffices, {
    fields: [requisitions.officeId],
    references: [companyOffices.id],
  }),
  level: one(jobLevels, {
    fields: [requisitions.levelId],
    references: [jobLevels.id],
  }),
}));

export type RequisitionWithPartialRelations = Requisition & {
  company?: Company;
  user?: User;
  workerType?: WorkerType;
  workerSubType?: WorkerSubType;
  reason?: RequisitionReason;
  location?: Location;
  office?: Office;
  level?: JobLevel;
};

// Company worker types
export const companyWorkerTypes = pgTable(
  "company_worker_type",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    companyId: d
      .uuid()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.varchar({ length: 256 }),
    isActive: d.boolean().notNull().default(true),
    deletedAt: d.timestamp({ withTimezone: true }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("company_worker_type_company_id_idx").on(t.companyId),
    uniqueIndex("company_worker_type_company_name_idx").on(t.companyId, t.name),
  ],
);

export type WorkerType = InferSelectModel<typeof companyWorkerTypes>;

export const companyWorkerSubTypes = pgTable(
  "company_worker_sub_type",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    companyId: d
      .uuid()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.varchar({ length: 256 }),
    isActive: d.boolean().notNull().default(true),
    deletedAt: d.timestamp({ withTimezone: true }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("company_worker_sub_type_company_id_idx").on(t.companyId),
    uniqueIndex("company_worker_sub_type_company_name_idx").on(
      t.companyId,
      t.name,
    ),
  ],
);

export type WorkerSubType = InferSelectModel<typeof companyWorkerSubTypes>;

export const companyRequisitionReasons = pgTable(
  "company_requisition_reason",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    companyId: d
      .uuid()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.varchar({ length: 256 }),
    isActive: d.boolean().notNull().default(true),
    deletedAt: d.timestamp({ withTimezone: true }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("company_requisition_reason_company_id_idx").on(t.companyId),
    uniqueIndex("company_requisition_reason_company_name_idx").on(
      t.companyId,
      t.name,
    ),
  ],
);

export type RequisitionReason = InferSelectModel<
  typeof companyRequisitionReasons
>;

export const companyLocations = pgTable(
  "company_location",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    companyId: d
      .uuid()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.varchar({ length: 256 }),
    isActive: d.boolean().notNull().default(true),
    deletedAt: d.timestamp({ withTimezone: true }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("company_location_company_id_idx").on(t.companyId),
    uniqueIndex("company_location_company_name_idx").on(t.companyId, t.name),
  ],
);

export type Location = InferSelectModel<typeof companyLocations>;

export const companyOffices = pgTable(
  "company_office",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    companyId: d
      .uuid()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.varchar({ length: 256 }),
    isActive: d.boolean().notNull().default(true),
    deletedAt: d.timestamp({ withTimezone: true }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("company_office_company_id_idx").on(t.companyId),
    uniqueIndex("company_office_company_name_idx").on(t.companyId, t.name),
  ],
);

export type Office = InferSelectModel<typeof companyOffices>;

export const jobLevels = pgTable(
  "job_level",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    companyId: d
      .uuid()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.varchar({ length: 256 }),
    isActive: d.boolean().notNull().default(true),
    deletedAt: d.timestamp({ withTimezone: true }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("job_level_company_id_idx").on(t.companyId),
    uniqueIndex("job_level_company_name_idx").on(t.companyId, t.name),
  ],
);

export type JobLevel = InferSelectModel<typeof jobLevels>;

export const companyLocationRelations = relations(
  companyLocations,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyLocations.companyId],
      references: [companies.id],
    }),
  }),
);

export const companyWorkerTypeRelations = relations(
  companyWorkerTypes,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyWorkerTypes.companyId],
      references: [companies.id],
    }),
  }),
);
export const companyWorkerSubTypeRelations = relations(
  companyWorkerSubTypes,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyWorkerSubTypes.companyId],
      references: [companies.id],
    }),
  }),
);
export const companyRequisitionReasonRelations = relations(
  companyRequisitionReasons,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyRequisitionReasons.companyId],
      references: [companies.id],
    }),
  }),
);
export const companyOfficeRelations = relations(companyOffices, ({ one }) => ({
  company: one(companies, {
    fields: [companyOffices.companyId],
    references: [companies.id],
  }),
}));
export const jobLevelRelations = relations(jobLevels, ({ one }) => ({
  company: one(companies, {
    fields: [jobLevels.companyId],
    references: [companies.id],
  }),
}));
