import {
  countSuratKeteranganJalans,
  deleteSuratKeteranganJalan,
  getSuratKeteranganJalanById,
  getSuratKeteranganJalans,
  insertSuratKeteranganJalan,
  insertSuratKeteranganJalanSchema,
  searchSuratKeteranganJalans,
  updateSuratKeteranganJalan,
  updateSuratKeteranganJalanSchema,
  type SelectSuratKeteranganJalan,
} from "@/lib/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganJalanRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratKeteranganJalanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratKeteranganJalan(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratKeteranganJalanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganJalan(input as SelectSuratKeteranganJalan),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratKeteranganJalan(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratKeteranganJalans(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSuratKeteranganJalanById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchSuratKeteranganJalans(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKeteranganJalans())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
