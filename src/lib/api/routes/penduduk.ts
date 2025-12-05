import {
  countPenduduks,
  deletePenduduk,
  getPendudukById,
  getPenduduks,
  getPenduduksByJenisKelamin,
  insertPenduduk,
  insertPendudukSchema,
  jenisKelamin,
  searchPenduduks,
  searchPenduduksByJenisKelamin,
  updatePenduduk,
  updatePendudukSchema,
  type SelectPenduduk,
} from "@/lib/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const pendudukRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertPendudukSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertPenduduk(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updatePendudukSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updatePenduduk(input as SelectPenduduk),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deletePenduduk(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getPenduduks(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getPendudukById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  byJenisKelamin: staffProtectedProcedure
    .input(jenisKelamin)
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getPenduduksByJenisKelamin(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchPenduduks(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  searchByJenisKelamin: staffProtectedProcedure
    .input(
      z.object({
        searchQuery: z.string(),
        jenisKelamin: jenisKelamin,
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        searchPenduduksByJenisKelamin({
          searchQuery: input.searchQuery,
          jenisKelamin: input.jenisKelamin,
        }),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countPenduduks())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
