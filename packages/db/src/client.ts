import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as relations from "./relations";
import * as schema from "./schema";

export const db = drizzle({
  client: sql,
  schema: {
    ...schema,
    ...relations,
  },
  logger: true,
  casing: "snake_case",
});
