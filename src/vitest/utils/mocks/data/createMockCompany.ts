import { type Company } from "@/server/db/schema";

/**
 * Creates a mock company with the correct type from the database schema
 */
export const createMockCompany = (id = "company_123"): Company => ({
  id,
  name: `Acme Corp ${id.split("_")[1]}`,
  logo: `https://example.com/logo_${id.split("_")[1]}.png`,
  creatorId: "user_123",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});
