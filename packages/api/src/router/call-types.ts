import { createTRPCRouter, publicProcedure } from "../trpc";

export const callTypesRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => ctx.db.query.callTypes.findMany()),
});
