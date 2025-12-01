import {
  countSuratKeteranganUsahas,
  deleteSuratKeteranganUsaha,
  getSuratKeteranganUsahaById,
  getSuratKeteranganUsahas,
  insertSuratKeteranganUsaha,
  insertSuratKeteranganUsahaSchema,
  searchSuratKeteranganUsahas,
  updateSuratKeteranganUsaha,
  updateSuratKeteranganUsahaSchema,
  type SelectSuratKeteranganUsaha,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganUsahaRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratKeteranganUsahaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratKeteranganUsaha(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratKeteranganUsahaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganUsaha(input as SelectSuratKeteranganUsaha),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratKeteranganUsaha(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratKeteranganUsahas(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSuratKeteranganUsahaById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchSuratKeteranganUsahas(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKeteranganUsahas())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
