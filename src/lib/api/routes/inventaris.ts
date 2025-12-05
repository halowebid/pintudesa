import {
  countInventarises,
  deleteInventaris,
  getInventarisById,
  getInventarises,
  insertInventaris,
  insertInventarisSchema,
  searchInventarises,
  updateInventaris,
  updateInventarisSchema,
  type SelectInventaris,
} from "@/lib/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const inventarisRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertInventarisSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertInventaris(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateInventarisSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateInventaris(input as SelectInventaris),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteInventaris(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getInventarises(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getInventarisById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchInventarises(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countInventarises())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
