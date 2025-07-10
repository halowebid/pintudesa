import {
  accountTable,
  db,
  sessionTable,
  userTable,
  verificationTable,
} from "@pintudesa/db"
import { betterAuth, type BetterAuthOptions } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

export function initAuth(options: {
  baseUrl: string
  secret: string | undefined
  corsOrigin: string
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: userTable,
        session: sessionTable,
        account: accountTable,
        verification: verificationTable,
      },
    }),
    trustedOrigins: [options.corsOrigin],
    emailAndPassword: {
      enabled: true,
    },
    baseURL: options.baseUrl,
    secret: options.secret,
  } satisfies BetterAuthOptions

  return betterAuth(config)
}

export type Auth = ReturnType<typeof initAuth>
export type Session = Auth["$Infer"]["Session"]
