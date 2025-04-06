// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { z } from "zod";
import { initTRPC } from "@trpc/server";

// Create a completely standalone tRPC server with no imports
const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// Create a minimal router with no external imports
const minimalRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
});

// Export type
export type MinimalRouter = typeof minimalRouter;

// Export API handler
export default createNextApiHandler({
  router: minimalRouter,
  createContext: () => ({}),
});
