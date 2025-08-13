import {
  countSuratKeteranganKepemilikanRumahs,
  deleteSuratKeteranganKepemilikanRumah,
  getSuratKeteranganKepemilikanRumahById,
  getSuratKeteranganKepemilikanRumahs,
  insertSuratKeteranganKepemilikanRumah,
  insertSuratKeteranganKepemilikanRumahSchema,
  searchSuratKeteranganKepemilikanRumahs,
  updateSuratKeteranganKepemilikanRumah,
  updateSuratKeteranganKepemilikanRumahSchema,
  type SelectSuratKeteranganKepemilikanRumah,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganKepemilikanRumahRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSuratKeteranganKepemilikanRumahSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratKeteranganKepemilikanRumah(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateSuratKeteranganKepemilikanRumahSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganKepemilikanRumah(
          input as SelectSuratKeteranganKepemilikanRumah,
        ),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        deleteSuratKeteranganKepemilikanRumah(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratKeteranganKepemilikanRumahs(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratKeteranganKepemilikanRumahById(input),
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
        searchSuratKeteranganKepemilikanRumahs(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(
      countSuratKeteranganKepemilikanRumahs(),
    )
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
