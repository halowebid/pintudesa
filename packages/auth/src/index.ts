import {
  accountTable,
  db,
  sessionTable,
  userTable,
  verificationTable,
} from "@pintudesa/db"
import { betterAuth, type BetterAuthOptions } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"

/**
 * Initialize Better Auth with admin plugin for user management
 * @param options - Configuration options for authentication
 * @returns Configured Better Auth instance with admin capabilities
 */
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
    /**
     * Admin plugin configuration
     * Enables role-based access control and user management features
     */
    plugins: [
      admin({
        defaultRole: "user",
        adminRoles: ["admin"],
        impersonationSessionDuration: 60 * 60, // 1 hour
        defaultBanReason: "Melanggar ketentuan penggunaan sistem",
      }),
    ],
  } satisfies BetterAuthOptions

  return betterAuth(config)
}

export type Auth = ReturnType<typeof initAuth>
export type Session = Auth["$Infer"]["Session"]
