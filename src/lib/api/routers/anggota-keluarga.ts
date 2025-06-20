import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertAnggotaKeluargaSchema,
  updateAnggotaKeluargaSchema,
  type SelectAnggotaKeluarga,
} from "@/lib/db/schema/anggota-keluarga"
import {
  countAnggotaKeluargas,
  deleteAnggotaKeluarga,
  getAnggotaKeluargaById,
  getAnggotaKeluargas,
  insertAnggotaKeluarga,
  searchAnggotaKeluargas,
  updateAnggotaKeluarga,
} from "@/lib/db/service/anggota-keluarga"

export const anggotaKeluargaRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertAnggotaKeluargaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertAnggotaKeluarga(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting anggotaKeluarga",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateAnggotaKeluargaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateAnggotaKeluarga(input as SelectAnggotaKeluarga),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting anggotaKeluarga",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteAnggotaKeluarga(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting anggotaKeluarga",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getAnggotaKeluargas(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching anggotaKeluargas",
        })
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getAnggotaKeluargaById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching anggotaKeluarga by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchAnggotaKeluargas(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching anggotaKeluargas",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countAnggotaKeluargas())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting anggotaKeluargas",
      })
    }
    return data
  }),
})
