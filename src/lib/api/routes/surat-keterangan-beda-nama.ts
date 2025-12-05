import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  countSuratKeteranganBedaNamas,
  deleteSuratKeteranganBedaNama,
  getSuratKeteranganBedaNamaById,
  getSuratKeteranganBedaNamas,
  insertSuratKeteranganBedaNama,
  insertSuratKeteranganBedaNamaSchema,
  searchSuratKeteranganBedaNamas,
  updateSuratKeteranganBedaNama,
  updateSuratKeteranganBedaNamaSchema,
  type SelectSuratKeteranganBedaNama,
} from "@/lib/db"
import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganBedaNamaRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratKeteranganBedaNamaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratKeteranganBedaNama(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratKeteranganBedaNamaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganBedaNama(input as SelectSuratKeteranganBedaNama),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        deleteSuratKeteranganBedaNama(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratKeteranganBedaNamas(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratKeteranganBedaNamaById(input),
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
        searchSuratKeteranganBedaNamas(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKeteranganBedaNamas())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
