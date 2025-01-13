import { observable } from "@trpc/server/observable";
import { z } from "zod";

import { eq } from "@acme/db";
import { protocolAudits, protocols } from "@acme/db/schema";

import { EVENTS } from "../events";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const protocolsRouter = createTRPCRouter({
  ofMine: protectedProcedure.query(async ({ ctx }) => {
    const myProtocol = await ctx.db.query.protocols.findFirst({
      with: {
        call: true,
        emergency: true,
      },
      where: eq(protocols.userId, ctx.session.user.id),
    });

    return myProtocol ?? null;
  }),

  open: protectedProcedure
    .input(z.object({ protocolId: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;

        await tx.insert(protocolAudits).values({
          protocolId: input.protocolId,
          userId,
          action: "open",
        });

        const [openedProtocol] = await ctx.db
          .update(protocols)
          .set({
            ownerId: userId,
            userId,
          })
          .where(eq(protocols.id, input.protocolId))
          .returning();

        ctx.ee.emit(
          EVENTS.PROTOCOL_AUDIT_INSERTED,
          EVENTS.PROTOCOL_AUDIT_INSERTED,
        );

        return openedProtocol ?? null;
      }),
    ),

  close: protectedProcedure.mutation(({ ctx }) =>
    ctx.db.transaction(async (tx) => {
      const userId = ctx.session.user.id;

      const [closedProtocol] = await ctx.db
        .update(protocols)
        .set({
          userId: null,
        })
        .where(eq(protocols.userId, userId))
        .returning();

      await tx.insert(protocolAudits).values({
        protocolId: closedProtocol!.id,
        userId,
        action: "stand_by",
      });

      ctx.ee.emit(
        EVENTS.PROTOCOL_AUDIT_INSERTED,
        EVENTS.PROTOCOL_AUDIT_INSERTED,
      );

      return closedProtocol ?? null;
    }),
  ),

  putOnQueue: protectedProcedure.mutation(({ ctx }) =>
    ctx.db.transaction(async (tx) => {
      const userId = ctx.session.user.id;

      const [protocol] = await ctx.db
        .update(protocols)
        .set({
          ownerId: null,
          userId: null,
        })
        .where(eq(protocols.userId, userId))
        .returning();

      await tx.insert(protocolAudits).values({
        protocolId: protocol!.id,
        userId,
        action: "queue",
      });

      ctx.ee.emit(
        EVENTS.PROTOCOL_AUDIT_INSERTED,
        EVENTS.PROTOCOL_AUDIT_INSERTED,
      );

      return protocol ?? null;
    }),
  ),

  send: protectedProcedure
    .input(z.object({ recipientId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;

        const [protocol] = await ctx.db
          .update(protocols)
          .set({
            ownerId: input.recipientId,
            userId: null,
          })
          .where(eq(protocols.userId, userId))
          .returning();

        await tx.insert(protocolAudits).values({
          protocolId: protocol!.id,
          userId,
          action: "send",
        });

        ctx.ee.emit(
          EVENTS.PROTOCOL_AUDIT_INSERTED,
          EVENTS.PROTOCOL_AUDIT_INSERTED,
        );

        return protocol ?? null;
      }),
    ),

  finish: protectedProcedure.mutation(({ ctx }) =>
    ctx.db.transaction(async (tx) => {
      const userId = ctx.session.user.id;

      const [protocol] = await ctx.db
        .update(protocols)
        .set({
          ownerId: null,
          userId: null,
        })
        .where(eq(protocols.userId, userId))
        .returning();

      await tx.insert(protocolAudits).values({
        protocolId: protocol!.id,
        userId,
        action: "finish",
      });

      ctx.ee.emit(
        EVENTS.PROTOCOL_AUDIT_INSERTED,
        EVENTS.PROTOCOL_AUDIT_INSERTED,
      );

      return protocol ?? null;
    }),
  ),

  onAuditInsert: publicProcedure.subscription(({ ctx }) => {
    return observable<string>((emit) => {
      const listener = (eventName: string) => {
        emit.next(eventName);
      };

      ctx.ee.on(EVENTS.PROTOCOL_AUDIT_INSERTED, listener);

      return () => {
        ctx.ee.off(EVENTS.PROTOCOL_AUDIT_INSERTED, listener);
      };
    });
  }),
});
