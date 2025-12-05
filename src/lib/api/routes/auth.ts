import type { TRPCRouterRecord } from "@trpc/server"

import { protectedProcedure, publicProcedure } from "../trpc"

/**
 * Authentication router for session management
 * Provides endpoints for session retrieval and protected content access
 */
export const authRouter = {
  /**
   * Get the current user session
   *
   * @returns The current session object if authenticated, null otherwise
   */
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),

  /**
   * Get a secret message (protected endpoint for testing authentication)
   *
   * @returns A secret message string only visible to authenticated users
   */
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!"
  }),
} satisfies TRPCRouterRecord
