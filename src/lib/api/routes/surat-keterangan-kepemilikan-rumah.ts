import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

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
} from "@/lib/db"
import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganKepemilikanRumahRouter = createTRPCRouter({
  create: staffProtectedProcedure
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

  update: staffProtectedProcedure
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

  delete: staffProtectedProcedure
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

  all: staffProtectedProcedure
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

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
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
