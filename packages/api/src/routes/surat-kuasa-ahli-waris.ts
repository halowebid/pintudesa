import {
  countSuratKuasaAhliWariss,
  deleteSuratKuasaAhliWaris,
  getSuratKuasaAhliWarisById,
  getSuratKuasaAhliWariss,
  insertSuratKuasaAhliWaris,
  insertSuratKuasaAhliWarisSchema,
  searchSuratKuasaAhliWariss,
  updateSuratKuasaAhliWaris,
  updateSuratKuasaAhliWarisSchema,
  type SelectSuratKuasaAhliWaris,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKuasaAhliWarisRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSuratKuasaAhliWarisSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratKuasaAhliWaris(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateSuratKuasaAhliWarisSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKuasaAhliWaris(input as SelectSuratKuasaAhliWaris),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratKuasaAhliWaris(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratKuasaAhliWariss(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSuratKuasaAhliWarisById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchSuratKuasaAhliWariss(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKuasaAhliWariss())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
