import { betterAuth, type BetterAuthOptions } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"

import {
  accountTable,
  db,
  sessionTable,
  userTable,
  verificationTable,
} from "@/lib/db"

/**
 * Initializes Better Auth with database adapter and admin plugin for user management
 *
 * Configures authentication with email/password support, role-based access control,
 * and user impersonation capabilities. Uses Drizzle ORM with PostgreSQL adapter.
 *
 * @param options - Configuration options for authentication
 * @param options.baseUrl - Base URL for authentication endpoints
 * @param options.secret - Secret key for session encryption
 * @param options.corsOrigin - Allowed CORS origin URL
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
