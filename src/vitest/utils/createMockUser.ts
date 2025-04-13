export const createMockUser = (id = "user_123") => ({
  id,
  email: `${id}@zenjin.io`,
  name: "Snakeface",
});
