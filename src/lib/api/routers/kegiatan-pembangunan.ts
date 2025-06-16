import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertKegiatanPembangunanSchema,
  updateKegiatanPembangunanSchema,
  type SelectKegiatanPembangunan,
} from "@/lib/db/schema/kegiatan-pembangunan"
import {
  countKegiatanPembangunans,
  deleteKegiatanPembangunan,
  getKegiatanPembangunanById,
  getKegiatanPembangunans,
  insertKegiatanPembangunan,
  searchKegiatanPembangunans,
  updateKegiatanPembangunan,
} from "@/lib/db/service/kegiatan-pembangunan"

export const kegiatanPembangunanRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertKegiatanPembangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertKegiatanPembangunan(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting kegiatanPembangunan",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateKegiatanPembangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateKegiatanPembangunan(input as SelectKegiatanPembangunan),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting kegiatanPembangunan",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteKegiatanPembangunan(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting kegiatanPembangunan",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getKegiatanPembangunans(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching kegiatanPembangunans",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getKegiatanPembangunanById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching kegiatanPembangunan by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchKegiatanPembangunans(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching kegiatanPembangunans",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countKegiatanPembangunans())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting kegiatanPembangunans",
      })
    }
    return data
  }),
})
