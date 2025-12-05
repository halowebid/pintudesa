import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  countAnggotaKeluargas,
  deleteAnggotaKeluarga,
  getAnggotaKeluargaById,
  getAnggotaKeluargaByKartuKeluargaId,
  getAnggotaKeluargas,
  insertAnggotaKeluarga,
  insertAnggotaKeluargaSchema,
  searchAnggotaKeluargas,
  updateAnggotaKeluarga,
  updateAnggotaKeluargaSchema,
  type SelectAnggotaKeluarga,
} from "@/lib/db"
import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const anggotaKeluargaRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertAnggotaKeluargaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertAnggotaKeluarga(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateAnggotaKeluargaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateAnggotaKeluarga(input as SelectAnggotaKeluarga),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteAnggotaKeluarga(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getAnggotaKeluargas(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getAnggotaKeluargaById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  byKartuKeluargaId: staffProtectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getAnggotaKeluargaByKartuKeluargaId(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchAnggotaKeluargas(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countAnggotaKeluargas())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
