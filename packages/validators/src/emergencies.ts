import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { emergencies } from "@acme/db/schema";

export const upsertEmergencySchema = createInsertSchema(emergencies, {
  city: z.string().min(1),
  complement: z.string().optional(),
  coordinates: z.string().optional(),
  title: z.string().min(1).max(100),
  landmark: z.string().min(1),
  neighborhood: z.string().min(1),
  protocolId: z.number().positive(),
  street: z.string().min(1),
  streetNumber: z.coerce.number().positive(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type UpsertEmergencySchema = z.infer<typeof upsertEmergencySchema>;
