import { type Requisition } from "@/server/db/schema";

/**
 * Creates a mock requisition with the correct type from the database schema
 */
export const createMockRequisition = (
  id = "req_123",
  companyId = "company_123",
  userId = "user_123",
): Requisition => ({
  id,
  companyId,
  userId,
  requisitionNumber: `REQ-${id.split("_")[1]}`,
  title: `Requisition ${id.split("_")[1]}`,
  levelId: "level_123",
  typeId: "type_123",
  subTypeId: "subtype_123",
  reasonId: "reason_123",
  locationId: "location_123",
  officeId: "office_123",
  description: `Description for requisition ${id.split("_")[1]}`,
  status: "DRAFT",
  version: 1,
  changeHistory: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});
