import { createTRPCRouter, publicProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => ctx.db.query.users.findMany()),
});
