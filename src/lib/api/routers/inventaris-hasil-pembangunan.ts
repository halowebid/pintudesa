import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertInventarisHasilPembangunanSchema,
  updateInventarisHasilPembangunanSchema,
  type SelectInventarisHasilPembangunan,
} from "@/lib/db/schema/inventaris-hasil-pembangunan"
import {
  countInventarisHasilPembangunans,
  deleteInventarisHasilPembangunan,
  getInventarisHasilPembangunanById,
  getInventarisHasilPembangunans,
  insertInventarisHasilPembangunan,
  searchInventarisHasilPembangunans,
  updateInventarisHasilPembangunan,
} from "@/lib/db/service/inventaris-hasil-pembangunan"

export const inventarisHasilPembangunanRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertInventarisHasilPembangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertInventarisHasilPembangunan(input),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting inventarisHasilPembangunan",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateInventarisHasilPembangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateInventarisHasilPembangunan(
          input as SelectInventarisHasilPembangunan,
        ),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting inventarisHasilPembangunan",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        deleteInventarisHasilPembangunan(input),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting inventarisHasilPembangunan",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getInventarisHasilPembangunans(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching inventarisHasilPembangunans",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getInventarisHasilPembangunanById(input),
    )
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching inventarisHasilPembangunan by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        searchInventarisHasilPembangunans(input),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching inventarisHasilPembangunans",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countInventarisHasilPembangunans())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting inventarisHasilPembangunans",
      })
    }
    return data
  }),
})
