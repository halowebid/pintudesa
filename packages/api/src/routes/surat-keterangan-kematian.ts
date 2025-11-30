import {
  countSuratKeteranganKematians,
  deleteSuratKeteranganKematian,
  getSuratKeteranganKematianById,
  getSuratKeteranganKematians,
  insertSuratKeteranganKematian,
  insertSuratKeteranganKematianSchema,
  searchSuratKeteranganKematians,
  updateSuratKeteranganKematian,
  updateSuratKeteranganKematianSchema,
  type SelectSuratKeteranganKematian,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganKematianRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratKeteranganKematianSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratKeteranganKematian(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratKeteranganKematianSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganKematian(input as SelectSuratKeteranganKematian),
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
        deleteSuratKeteranganKematian(input),
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
        getSuratKeteranganKematians(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratKeteranganKematianById(input),
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
        searchSuratKeteranganKematians(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKeteranganKematians())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
