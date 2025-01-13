import { eq, notInArray } from "@acme/db";
import { emergencies, protocolAudits } from "@acme/db/schema";
import { upsertEmergencySchema } from "@acme/validators/emergencies";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const emergenciesRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(upsertEmergencySchema)
    .mutation(async ({ ctx, input }) => {
      const [emergency] = await ctx.db
        .insert(emergencies)
        .values(input)
        .onConflictDoUpdate({
          target: emergencies.protocolId,
          set: input,
        })
        .returning();

      return emergency ?? null;
    }),

  notFinished: protectedProcedure.query(async ({ ctx }) => {
    const finishedProtocolIdsQuery = ctx.db
      .select({ protocolId: protocolAudits.protocolId })
      .from(protocolAudits)
      .where(eq(protocolAudits.action, "finish"));

    const notFinishedEmergencies = await ctx.db.query.emergencies.findMany({
      with: {
        protocol: {
          columns: {
            ownerId: true,
            userId: true,
          },
        },
      },
      where: () => notInArray(emergencies.protocolId, finishedProtocolIdsQuery),
    });

    return notFinishedEmergencies;
  }),
});
