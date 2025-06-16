import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertTanahSchema,
  updateTanahSchema,
  type SelectTanah,
} from "@/lib/db/schema/tanah"
import {
  countTanahs,
  deleteTanah,
  getTanahById,
  getTanahs,
  insertTanah,
  searchTanahs,
  updateTanah,
} from "@/lib/db/service/tanah"

export const tanahRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertTanahSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertTanah(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting tanah",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateTanahSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(updateTanah(input as SelectTanah))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting tanah",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteTanah(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting tanah",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getTanahs(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching tanahs",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getTanahById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching tanah by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchTanahs(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching tanahs",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countTanahs())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting tanahs",
      })
    }
    return data
  }),
})
