import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertRABSchema,
  updateRABSchema,
  type SelectRAB,
} from "@/lib/db/schema/rab"
import {
  countRABs,
  deleteRAB,
  getRABById,
  getRABs,
  insertRAB,
  searchRABs,
  updateRAB,
} from "@/lib/db/service/rab"

export const rabRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertRABSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertRAB(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting rab",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateRABSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(updateRAB(input as SelectRAB))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting rab",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteRAB(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting rab",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getRABs(input.page, input.perPage))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching rabs",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getRABById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching rab by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchRABs(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching rabs",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countRABs())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting rabs",
      })
    }
    return data
  }),
})
