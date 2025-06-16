import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertLembaranSchema,
  updateLembaranSchema,
  type SelectLembaran,
} from "@/lib/db/schema/lembaran"
import {
  countLembarans,
  deleteLembaran,
  getLembaranById,
  getLembarans,
  insertLembaran,
  searchLembarans,
  updateLembaran,
} from "@/lib/db/service/lembaran"

export const lembaranRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertLembaranSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertLembaran(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting lembaran",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateLembaranSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateLembaran(input as SelectLembaran),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting lembaran",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteLembaran(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting lembaran",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getLembarans(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching lembarans",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getLembaranById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching lembaran by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchLembarans(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching lembarans",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countLembarans())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting lembarans",
      })
    }
    return data
  }),
})
