import {
  countSuratKeteranganKelahirans,
  deleteSuratKeteranganKelahiran,
  getSuratKeteranganKelahiranById,
  getSuratKeteranganKelahirans,
  insertSuratKeteranganKelahiran,
  insertSuratKeteranganKelahiranSchema,
  searchSuratKeteranganKelahirans,
  updateSuratKeteranganKelahiran,
  updateSuratKeteranganKelahiranSchema,
  type SelectSuratKeteranganKelahiran,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganKelahiranRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSuratKeteranganKelahiranSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratKeteranganKelahiran(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateSuratKeteranganKelahiranSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganKelahiran(input as SelectSuratKeteranganKelahiran),
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
        deleteSuratKeteranganKelahiran(input),
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
        getSuratKeteranganKelahirans(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratKeteranganKelahiranById(input),
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
        searchSuratKeteranganKelahirans(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKeteranganKelahirans())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
