import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { updateUserSchema, type SelectUser } from "@/lib/db/schema/user"
import {
  countUsers,
  deleteUser,
  getUserById,
  getUserByUsername,
  getUsers,
  searchUsers,
  updateUser,
} from "@/lib/db/service/user"

export const userRouter = createTRPCRouter({
  update: adminProtectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(updateUser(input as SelectUser))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting agenda",
        })
      }
      return data
    }),
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteUser(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting user",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getUsers(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching users",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getUserById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching user",
      })
    }
    return data
  }),

  byUsername: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getUserByUsername(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching user",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchUsers(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching users",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countUsers())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting users",
      })
    }
    return data
  }),
})
