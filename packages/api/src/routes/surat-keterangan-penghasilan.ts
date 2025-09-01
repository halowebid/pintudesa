import {
  countSuratKeteranganPenghasilans,
  deleteSuratKeteranganPenghasilan,
  getSuratKeteranganPenghasilanById,
  getSuratKeteranganPenghasilans,
  insertSuratKeteranganPenghasilan,
  insertSuratKeteranganPenghasilanSchema,
  searchSuratKeteranganPenghasilans,
  updateSuratKeteranganPenghasilan,
  updateSuratKeteranganPenghasilanSchema,
  type SelectSuratKeteranganPenghasilan,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganPenghasilanRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSuratKeteranganPenghasilanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratKeteranganPenghasilan(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateSuratKeteranganPenghasilanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganPenghasilan(
          input as SelectSuratKeteranganPenghasilan,
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
        deleteSuratKeteranganPenghasilan(input),
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
        getSuratKeteranganPenghasilans(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratKeteranganPenghasilanById(input),
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
        searchSuratKeteranganPenghasilans(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKeteranganPenghasilans())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
