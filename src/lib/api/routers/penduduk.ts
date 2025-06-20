import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertPendudukSchema,
  updatePendudukSchema,
  type SelectPenduduk,
} from "@/lib/db/schema/penduduk"
import {
  countPenduduks,
  deletePenduduk,
  getPendudukById,
  getPenduduks,
  insertPenduduk,
  searchPenduduks,
  updatePenduduk,
} from "@/lib/db/service/penduduk"

export const pendudukRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertPendudukSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertPenduduk(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting penduduk",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updatePendudukSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updatePenduduk(input as SelectPenduduk),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting penduduk",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deletePenduduk(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting penduduk",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getPenduduks(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching penduduks",
        })
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getPendudukById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching penduduk by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchPenduduks(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching penduduks",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countPenduduks())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting penduduks",
      })
    }
    return data
  }),
})
