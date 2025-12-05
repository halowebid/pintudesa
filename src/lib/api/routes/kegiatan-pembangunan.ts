import {
  countKegiatanPembangunans,
  deleteKegiatanPembangunan,
  getKegiatanPembangunanById,
  getKegiatanPembangunans,
  insertKegiatanPembangunan,
  insertKegiatanPembangunanSchema,
  searchKegiatanPembangunans,
  updateKegiatanPembangunan,
  updateKegiatanPembangunanSchema,
  type SelectKegiatanPembangunan,
} from "@/lib/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const kegiatanPembangunanRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertKegiatanPembangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertKegiatanPembangunan(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateKegiatanPembangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateKegiatanPembangunan(input as SelectKegiatanPembangunan),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteKegiatanPembangunan(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getKegiatanPembangunans(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getKegiatanPembangunanById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchKegiatanPembangunans(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countKegiatanPembangunans())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
