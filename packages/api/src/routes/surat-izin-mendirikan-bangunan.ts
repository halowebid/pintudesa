import {
  countSuratIzinMendirikanBangunans,
  deleteSuratIzinMendirikanBangunan,
  getSuratIzinMendirikanBangunanById,
  getSuratIzinMendirikanBangunans,
  insertSuratIzinMendirikanBangunan,
  insertSuratIzinMendirikanBangunanSchema,
  searchSuratIzinMendirikanBangunans,
  updateSuratIzinMendirikanBangunan,
  updateSuratIzinMendirikanBangunanSchema,
  type SelectSuratIzinMendirikanBangunan,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratIzinMendirikanBangunanRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSuratIzinMendirikanBangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratIzinMendirikanBangunan(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateSuratIzinMendirikanBangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratIzinMendirikanBangunan(
          input as SelectSuratIzinMendirikanBangunan,
        ),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        deleteSuratIzinMendirikanBangunan(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratIzinMendirikanBangunans(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratIzinMendirikanBangunanById(input),
    )
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        searchSuratIzinMendirikanBangunans(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratIzinMendirikanBangunans())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
