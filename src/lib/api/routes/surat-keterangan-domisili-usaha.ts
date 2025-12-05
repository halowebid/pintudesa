import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  countSuratKeteranganDomisiliUsahas,
  deleteSuratKeteranganDomisiliUsaha,
  getSuratKeteranganDomisiliUsahaById,
  getSuratKeteranganDomisiliUsahas,
  insertSuratKeteranganDomisiliUsaha,
  insertSuratKeteranganDomisiliUsahaSchema,
  searchSuratKeteranganDomisiliUsahas,
  updateSuratKeteranganDomisiliUsaha,
  updateSuratKeteranganDomisiliUsahaSchema,
  type SelectSuratKeteranganDomisiliUsaha,
} from "@/lib/db"
import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganDomisiliUsahaRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratKeteranganDomisiliUsahaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratKeteranganDomisiliUsaha(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratKeteranganDomisiliUsahaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganDomisiliUsaha(
          input as SelectSuratKeteranganDomisiliUsaha,
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
        deleteSuratKeteranganDomisiliUsaha(input),
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
        getSuratKeteranganDomisiliUsahas(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratKeteranganDomisiliUsahaById(input),
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
        searchSuratKeteranganDomisiliUsahas(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKeteranganDomisiliUsahas())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
