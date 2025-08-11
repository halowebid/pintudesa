import {
  countSuratKeteranganDomisilis,
  deleteSuratKeteranganDomisili,
  getSuratKeteranganDomisiliById,
  getSuratKeteranganDomisilis,
  insertSuratKeteranganDomisili,
  insertSuratKeteranganDomisiliSchema,
  searchSuratKeteranganDomisilis,
  updateSuratKeteranganDomisili,
  updateSuratKeteranganDomisiliSchema,
  type SelectSuratKeteranganDomisili,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratKeteranganDomisiliRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(
      insertSuratKeteranganDomisiliSchema.extend({
        pendudukIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratKeteranganDomisili({
          ...input,
          pendudukIds: Array.isArray(input.pendudukIds)
            ? input.pendudukIds
            : [],
        }),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateSuratKeteranganDomisiliSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratKeteranganDomisili(input as SelectSuratKeteranganDomisili),
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
        deleteSuratKeteranganDomisili(input),
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
        getSuratKeteranganDomisilis(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratKeteranganDomisiliById(input),
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
        searchSuratKeteranganDomisilis(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratKeteranganDomisilis())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
