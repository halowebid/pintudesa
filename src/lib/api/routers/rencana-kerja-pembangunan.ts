import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertRencanaKerjaPembangunanSchema,
  updateRencanaKerjaPembangunanSchema,
  type SelectRencanaKerjaPembangunan,
} from "@/lib/db/schema/rencana-kerja-pembangunan"
import {
  countRencanaKerjaPembangunans,
  deleteRencanaKerjaPembangunan,
  getRencanaKerjaPembangunanById,
  getRencanaKerjaPembangunans,
  insertRencanaKerjaPembangunan,
  searchRencanaKerjaPembangunans,
  updateRencanaKerjaPembangunan,
} from "@/lib/db/service/rencana-kerja-pembangunan"

export const rencanaKerjaPembangunanRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertRencanaKerjaPembangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertRencanaKerjaPembangunan(input),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting rencanaKerjaPembangunan",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateRencanaKerjaPembangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateRencanaKerjaPembangunan(input as SelectRencanaKerjaPembangunan),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting rencanaKerjaPembangunan",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        deleteRencanaKerjaPembangunan(input),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting rencanaKerjaPembangunan",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getRencanaKerjaPembangunans(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching rencanaKerjaPembangunans",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getRencanaKerjaPembangunanById(input),
    )
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching rencanaKerjaPembangunan by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        searchRencanaKerjaPembangunans(input),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching rencanaKerjaPembangunans",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countRencanaKerjaPembangunans())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting rencanaKerjaPembangunans",
      })
    }
    return data
  }),
})
