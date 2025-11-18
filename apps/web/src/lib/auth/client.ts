import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

/**
 * Auth client for web application
 * Admin client enabled for type safety, write operations should only be used in panel app
 */
export const authClient = createAuthClient({
  plugins: [adminClient()],
})
