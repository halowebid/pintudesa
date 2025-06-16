import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertEkspedisiSchema,
  updateEkspedisiSchema,
  type SelectEkspedisi,
} from "@/lib/db/schema/ekspedisi"
import {
  countEkspedises,
  deleteEkspedisi,
  getEkspedises,
  getEkspedisiById,
  insertEkspedisi,
  searchEkspedises,
  updateEkspedisi,
} from "@/lib/db/service/ekspedisi"

export const ekspedisiRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertEkspedisiSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertEkspedisi(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting ekspedisi",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateEkspedisiSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateEkspedisi(input as SelectEkspedisi),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting ekspedisi",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteEkspedisi(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting ekspedisi",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getEkspedises(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching ekspedises",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getEkspedisiById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching ekspedisi by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchEkspedises(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching ekspedises",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countEkspedises())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting ekspedises",
      })
    }
    return data
  }),
})
