import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

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
} from "@/lib/db"
import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKuasaSKGRRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratKuasaSKGRSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratKuasaSKGR(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
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

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratKuasaSKGR(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
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

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
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
