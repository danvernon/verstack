import { MinimalRouter } from "@/app/api/trpc/[trpc]/route";
import { createTRPCReact } from "@trpc/react-query";

export const minimalApi = createTRPCReact<MinimalRouter>();
