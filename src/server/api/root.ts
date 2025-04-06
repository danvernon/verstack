"server-only";

import { postRouter } from "./routers/post";
import { createTRPCRouter } from "./trpc";

const appRouter = createTRPCRouter({
  posts: postRouter,
});

export default appRouter;
export type AppRouter = typeof appRouter;
