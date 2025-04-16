import { type User } from "@/server/db/schema";

/**
 * Creates a mock user with the correct type from the database schema
 */
export const createMockUser = (
  id = "user_123",
  companyId = "company_123",
): User => ({
  id,
  companyId,
});
