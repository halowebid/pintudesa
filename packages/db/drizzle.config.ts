import { databaseUrl } from "@pintudesa/env"
import { defineConfig, type Config } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema",
  out: "./src/migrations",
  dbCredentials: {
    url: databaseUrl!,
  },
  verbose: true,
  strict: true,
}) satisfies Config
