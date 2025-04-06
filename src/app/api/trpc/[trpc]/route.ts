import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
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

// Export API handler for App Router
export async function POST(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: minimalRouter,
    createContext: () => ({}),
  });
}
