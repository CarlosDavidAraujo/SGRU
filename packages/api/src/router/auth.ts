import type { TRPCRouterRecord } from "@trpc/server";

//import { invalidateSessionToken } from "@acme/auth";

import { publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  // signOut: protectedProcedure.mutation(async (opts) => {
  //   if (!opts.ctx.token) {
  //     return { success: false };
  //   }
  //   await signOut();
  //   return { success: true };
  // }),
} satisfies TRPCRouterRecord;
