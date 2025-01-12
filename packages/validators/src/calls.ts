import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { calls } from "@acme/db/schema";

const phoneRegex = /^\d{4,5}-?\d{4}$/;
// Aceita formatos como:
// XXXXX-XXXX (com traço)
// XXXXX XXXX (sem traço)
// XXXX-XXXX (com traço)
// XXXXXXXX (sem traço)

export const upsertCallSchema = createInsertSchema(calls, {
  protocolId: z.number().int().positive().optional(),
  typeId: z.number().int().positive(),
  originId: z.number().int().positive(),
  requesterName: z.string().min(1),
  codeArea: z.string().length(3),
  fone: z.string().min(1).regex(phoneRegex, "Formato de telefone inválido"),
  complain: z.string().min(1).max(255),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type UpsertCallSchema = z.infer<typeof upsertCallSchema>;
