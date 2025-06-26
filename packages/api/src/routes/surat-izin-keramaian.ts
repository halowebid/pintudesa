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
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratIzinKeramaianRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSuratIzinKeramaianSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratIzinKeramaian(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
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

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratIzinKeramaian(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
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

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
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
