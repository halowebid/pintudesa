import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertInventarisSchema,
  updateInventarisSchema,
  type SelectInventaris,
} from "@/lib/db/schema/inventaris"
import {
  countInventarises,
  deleteInventaris,
  getInventarisById,
  getInventarises,
  insertInventaris,
  searchInventarises,
  updateInventaris,
} from "@/lib/db/service/inventaris"

export const inventarisRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertInventarisSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertInventaris(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting inventaris",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateInventarisSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateInventaris(input as SelectInventaris),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting inventaris",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteInventaris(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting inventaris",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getInventarises(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching inventarises",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getInventarisById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching inventaris by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchInventarises(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching inventarises",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countInventarises())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting inventarises",
      })
    }
    return data
  }),
})
