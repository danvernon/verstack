import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { openrouterClient } from "@/utils/open-ai";

export const postRouter = createTRPCRouter({
  hello: protectedProcedure.query(async () => {
    const completion = await openrouterClient.chat.completions.create({
      model: "google/gemma-3-4b-it",
      messages: [
        {
          role: "user",
          content: `Create a detailed job description for a Graphic Designer position at Peppy Health.
                    Industry: Health
                    Department: Design
                    Key responsibilities:
                    - Create visually appealing designs
                    - Collaborate with the marketing team
                    Experience required: 3-5 years
                    Location: Remote
                    Employment type: Full-Time
                    Company tone: Casual`,
          // content: `Recommend a competitive salary range for:
          //           Position: Graphic Designer
          //           Location: Remote (United Kingdom)
          //           Experience level: MID
          //           Industry: Health
          //           Company size: MID-SIZE

          //           Please provide:
          //           1. Base salary range (25th-75th percentile)
          //           2. Information on typical benefits/bonuses
          //           3. How this compares to market averages`,
        },
      ],
    });

    return {
      greeting: completion.choices[0].message.content,
    };
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),
});
