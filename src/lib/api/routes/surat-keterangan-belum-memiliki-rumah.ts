import {
  countSuratKeteranganBelumMemilikiRumahs,
  deleteSuratKeteranganBelumMemilikiRumah,
  getSuratKeteranganBelumMemilikiRumahById,
  getSuratKeteranganBelumMemilikiRumahs,
  insertSuratKeteranganBelumMemilikiRumah,
  insertSuratKeteranganBelumMemilikiRumahSchema,
  searchSuratKeteranganBelumMemilikiRumahs,
  updateSuratKeteranganBelumMemilikiRumah,
  updateSuratKeteranganBelumMemilikiRumahSchema,
  type SelectSuratKeteranganBelumMemilikiRumah,
} from "@/lib/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganBelumMemilikiRumahRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratKeteranganBelumMemilikiRumahSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratKeteranganBelumMemilikiRumah(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratKeteranganBelumMemilikiRumahSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganBelumMemilikiRumah(
          input as SelectSuratKeteranganBelumMemilikiRumah,
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
        deleteSuratKeteranganBelumMemilikiRumah(input),
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
        getSuratKeteranganBelumMemilikiRumahs(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratKeteranganBelumMemilikiRumahById(input),
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
        searchSuratKeteranganBelumMemilikiRumahs(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(
      countSuratKeteranganBelumMemilikiRumahs(),
    )
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
