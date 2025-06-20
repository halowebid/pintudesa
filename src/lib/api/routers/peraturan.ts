import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertPeraturanSchema,
  updatePeraturanSchema,
  type SelectPeraturan,
} from "@/lib/db/schema/peraturan"
import {
  countPeraturans,
  deletePeraturan,
  getPeraturanById,
  getPeraturans,
  insertPeraturan,
  searchPeraturans,
  updatePeraturan,
} from "@/lib/db/service/peraturan"

export const peraturanRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertPeraturanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertPeraturan(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting peraturan",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updatePeraturanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updatePeraturan(input as SelectPeraturan),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting peraturan",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deletePeraturan(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting peraturan",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getPeraturans(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching peraturans",
        })
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getPeraturanById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching peraturan by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchPeraturans(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching peraturans",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countPeraturans())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting peraturans",
      })
    }
    return data
  }),
})
