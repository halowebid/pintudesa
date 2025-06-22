import { drizzle } from "drizzle-orm/node-postgres"

import * as schema from "./schema"
import { databaseUrl } from "./utils/env"

export const db = drizzle(databaseUrl, {
  schema: schema,
})
