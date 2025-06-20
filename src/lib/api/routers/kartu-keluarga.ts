import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertKartuKeluargaSchema,
  updateKartuKeluargaSchema,
  type SelectKartuKeluarga,
} from "@/lib/db/schema/kartu-keluarga"
import {
  countKartuKeluargas,
  deleteKartuKeluarga,
  getKartuKeluargaById,
  getKartuKeluargas,
  insertKartuKeluarga,
  searchKartuKeluargas,
  updateKartuKeluarga,
} from "@/lib/db/service/kartu-keluarga"

export const kartuKeluargaRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertKartuKeluargaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertKartuKeluarga(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting kartuKeluarga",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateKartuKeluargaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateKartuKeluarga(input as SelectKartuKeluarga),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting kartuKeluarga",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteKartuKeluarga(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting kartuKeluarga",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getKartuKeluargas(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching kartuKeluargas",
        })
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getKartuKeluargaById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching kartuKeluarga by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchKartuKeluargas(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching kartuKeluargas",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countKartuKeluargas())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting kartuKeluargas",
      })
    }
    return data
  }),
})
