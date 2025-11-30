import {
  countSuratKeteranganPenghasilanOrangTuas,
  deleteSuratKeteranganPenghasilanOrangTua,
  getSuratKeteranganPenghasilanOrangTuaById,
  getSuratKeteranganPenghasilanOrangTuas,
  insertSuratKeteranganPenghasilanOrangTua,
  insertSuratKeteranganPenghasilanOrangTuaSchema,
  searchSuratKeteranganPenghasilanOrangTuas,
  updateSuratKeteranganPenghasilanOrangTua,
  updateSuratKeteranganPenghasilanOrangTuaSchema,
  type SelectSuratKeteranganPenghasilanOrangTua,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganPenghasilanOrangTuaRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(
      insertSuratKeteranganPenghasilanOrangTuaSchema.extend({
        pendudukIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratKeteranganPenghasilanOrangTua(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratKeteranganPenghasilanOrangTuaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganPenghasilanOrangTua(
          input as SelectSuratKeteranganPenghasilanOrangTua,
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
        deleteSuratKeteranganPenghasilanOrangTua(input),
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
        getSuratKeteranganPenghasilanOrangTuas(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratKeteranganPenghasilanOrangTuaById(input),
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
        searchSuratKeteranganPenghasilanOrangTuas(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(
      countSuratKeteranganPenghasilanOrangTuas(),
    )
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
