import { unCachedGetCurrentSession } from "@pintudesa/auth"
import { db } from "@pintudesa/db"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { session, user } = await unCachedGetCurrentSession()

  return {
    session,
    user,
    db,
    ...opts,
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
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.user },
    },
  })
})

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (ctx.session && ctx.user?.role !== "admin") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be an admin",
    })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.user },
    },
  })
})

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
export const adminProtectedProcedure = t.procedure.use(enforceUserIsAdmin)
