import {
  countSuratPengantarSKCKs,
  deleteSuratPengantarSKCK,
  getSuratPengantarSKCKById,
  getSuratPengantarSKCKs,
  insertSuratPengantarSKCK,
  insertSuratPengantarSKCKSchema,
  searchSuratPengantarSKCKs,
  updateSuratPengantarSKCK,
  updateSuratPengantarSKCKSchema,
  type SelectSuratPengantarSKCK,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratPengantarSKCKRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratPengantarSKCKSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratPengantarSKCK(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratPengantarSKCKSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratPengantarSKCK(input as SelectSuratPengantarSKCK),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratPengantarSKCK(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratPengantarSKCKs(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSuratPengantarSKCKById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchSuratPengantarSKCKs(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratPengantarSKCKs())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
