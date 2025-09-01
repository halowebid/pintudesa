import {
  countSuratKeteranganGaibs,
  deleteSuratKeteranganGaib,
  getSuratKeteranganGaibById,
  getSuratKeteranganGaibs,
  insertSuratKeteranganGaib,
  insertSuratKeteranganGaibSchema,
  searchSuratKeteranganGaibs,
  updateSuratKeteranganGaib,
  updateSuratKeteranganGaibSchema,
  type SelectSuratKeteranganGaib,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganGaibRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSuratKeteranganGaibSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratKeteranganGaib(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateSuratKeteranganGaibSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganGaib(input as SelectSuratKeteranganGaib),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratKeteranganGaib(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratKeteranganGaibs(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSuratKeteranganGaibById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchSuratKeteranganGaibs(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKeteranganGaibs())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
