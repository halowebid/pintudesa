import {
  countSuratKuasaSKGRs,
  deleteSuratKuasaSKGR,
  getSuratKuasaSKGRById,
  getSuratKuasaSKGRs,
  insertSuratKuasaSKGR,
  insertSuratKuasaSKGRSchema,
  searchSuratKuasaSKGRs,
  updateSuratKuasaSKGR,
  updateSuratKuasaSKGRSchema,
  type SelectSuratKuasaSKGR,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKuasaSKGRRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSuratKuasaSKGRSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratKuasaSKGR(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateSuratKuasaSKGRSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKuasaSKGR(input as SelectSuratKuasaSKGR),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratKuasaSKGR(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratKuasaSKGRs(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSuratKuasaSKGRById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchSuratKuasaSKGRs(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKuasaSKGRs())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
