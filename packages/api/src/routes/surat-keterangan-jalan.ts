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
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganJalanRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(
      insertSuratKeteranganJalanSchema.extend({
        pendudukIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratKeteranganJalan({
          ...input,
          pendudukIds: Array.isArray(input.pendudukIds)
            ? input.pendudukIds
            : [],
        }),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
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

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratKeteranganJalan(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
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

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
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
