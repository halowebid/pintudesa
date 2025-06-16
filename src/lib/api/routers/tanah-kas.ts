import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertTanahKasSchema,
  updateTanahKasSchema,
  type SelectTanahKas,
} from "@/lib/db/schema/tanah-kas"
import {
  countTanahKases,
  deleteTanahKas,
  getTanahKasById,
  getTanahKases,
  insertTanahKas,
  searchTanahKases,
  updateTanahKas,
} from "@/lib/db/service/tanah-kas"

export const tanahKasRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertTanahKasSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertTanahKas(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting tanahKas",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateTanahKasSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateTanahKas(input as SelectTanahKas),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting tanahKas",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteTanahKas(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting tanahKas",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getTanahKases(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching tanahKases",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getTanahKasById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching tanahKas by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchTanahKases(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching tanahKases",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countTanahKases())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting tanahKases",
      })
    }
    return data
  }),
})
