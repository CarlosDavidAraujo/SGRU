import { authRouter } from "./router/auth";
import { callOriginsRouter } from "./router/call-origins";
import { callTypesRouter } from "./router/call-types";
import { callsRouter } from "./router/calls";
import { emergenciesRouter } from "./router/emergencies";
import { protocolsRouter } from "./router/protocols";
import { usersRouter } from "./router/users";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  callOrigin: callOriginsRouter,
  callTypes: callTypesRouter,
  calls: callsRouter,
  emergencies: emergenciesRouter,
  protocols: protocolsRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
