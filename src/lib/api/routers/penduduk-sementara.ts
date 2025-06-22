import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertPendudukSementaraSchema,
  updatePendudukSementaraSchema,
  type SelectPendudukSementara,
} from "@/lib/db/schema/penduduk-sementara"
import {
  countPendudukSementaras,
  deletePendudukSementara,
  getPendudukSementaraById,
  getPendudukSementaras,
  insertPendudukSementara,
  searchPendudukSementaras,
  updatePendudukSementara,
} from "@/lib/db/service/penduduk-sementara"

export const pendudukSementaraRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertPendudukSementaraSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertPendudukSementara(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting pendudukSementara",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updatePendudukSementaraSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updatePendudukSementara(input as SelectPendudukSementara),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting pendudukSementara",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deletePendudukSementara(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting pendudukSementara",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getPendudukSementaras(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching pendudukSementaras",
        })
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getPendudukSementaraById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching pendudukSementara by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchPendudukSementaras(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching pendudukSementaras",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countPendudukSementaras())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting pendudukSementaras",
      })
    }
    return data
  }),
})
