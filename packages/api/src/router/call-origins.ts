import { createTRPCRouter, publicProcedure } from "../trpc";

export const callOriginsRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => ctx.db.query.callOrigins.findMany()),
});
