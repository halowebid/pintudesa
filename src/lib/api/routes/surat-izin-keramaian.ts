import {
  countSuratIzinKeramaians,
  deleteSuratIzinKeramaian,
  getSuratIzinKeramaianById,
  getSuratIzinKeramaians,
  insertSuratIzinKeramaian,
  insertSuratIzinKeramaianSchema,
  searchSuratIzinKeramaians,
  updateSuratIzinKeramaian,
  updateSuratIzinKeramaianSchema,
  type SelectSuratIzinKeramaian,
} from "@/lib/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratIzinKeramaianRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratIzinKeramaianSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratIzinKeramaian(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratIzinKeramaianSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratIzinKeramaian(input as SelectSuratIzinKeramaian),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratIzinKeramaian(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratIzinKeramaians(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSuratIzinKeramaianById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchSuratIzinKeramaians(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratIzinKeramaians())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
