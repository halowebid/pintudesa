import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

import { type Auth } from "@/lib/auth"
import { db } from "@/lib/db"

export const createTRPCContext = async (opts: {
  headers: Headers
  auth: Auth
}) => {
  const authApi = opts.auth.api
  const session = await authApi.getSession({
    headers: opts.headers,
  })

  return {
    authApi,
    session,
    db,
    headers: opts.headers,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/**
 * Middleware to enforce admin role requirement
 * Ensures only users with "admin" role can access protected procedures
 */
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  if (ctx.session.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be an admin to perform this action",
    })
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/**
 * Middleware to enforce staff role requirement
 * Allows both "admin" and "member" roles for operational features
 * @throws {TRPCError} UNAUTHORIZED if no session exists
 * @throws {TRPCError} FORBIDDEN if user role is not "admin" or "member"
 */
const enforceUserIsStaff = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  const userRole = ctx.session.user.role
  if (userRole !== "admin" && userRole !== "member") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be a staff member to perform this action",
    })
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router

/**
 * Three-tier authorization model:
 * - publicProcedure: No authentication required
 * - protectedProcedure: Any authenticated user (role: "user" | "member" | "admin")
 * - staffProtectedProcedure: Staff members only (role: "member" | "admin")
 * - adminProtectedProcedure: Administrators only (role: "admin")
 */
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
export const staffProtectedProcedure = t.procedure.use(enforceUserIsStaff)
export const adminProtectedProcedure = t.procedure.use(enforceUserIsAdmin)
