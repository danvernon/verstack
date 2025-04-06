import { router, publicProcedure } from "./trpc";
import { z } from "zod";

// No DB import here initially for testing
export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
