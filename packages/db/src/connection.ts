import { databaseUrl } from "@pintudesa/env"
import { drizzle } from "drizzle-orm/node-postgres"

import * as schema from "./schema"

export const db = drizzle(databaseUrl!, {
  schema: schema,
})
