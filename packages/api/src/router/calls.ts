import { sql } from "@acme/db";
import { calls, protocolAudits, protocols } from "@acme/db/schema";
import { upsertCallSchema } from "@acme/validators/calls";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const callsRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(upsertCallSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { protocolId, ...callDto } = input;
      const isUpdating = !!protocolId;

      if (isUpdating) {
        const [updatedCall] = await ctx.db
          .update(calls)
          .set(callDto)
          .where(sql`${calls.protocolId} = ${protocolId}`)
          .returning();
        return updatedCall ?? null;
      }

      return ctx.db.transaction(async (tx) => {
        const [protocol] = await tx
          .insert(protocols)
          .values({
            ownerId: userId,
            userId,
          })
          .returning({ id: protocols.id });

        await tx.insert(protocolAudits).values({
          protocolId: protocol!.id,
          userId,
          action: "create",
        });

        const [createdCall] = await tx
          .insert(calls)
          .values({
            ...callDto,
            protocolId: protocol!.id,
          })
          .returning();

        return createdCall;
      });
    }),
});
