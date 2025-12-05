import {
  countTanahs,
  deleteTanah,
  getTanahById,
  getTanahs,
  insertTanah,
  insertTanahSchema,
  searchTanahs,
  updateTanah,
  updateTanahSchema,
  type SelectTanah,
} from "@/lib/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const tanahRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertTanahSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertTanah(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateTanahSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(updateTanah(input as SelectTanah))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteTanah(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getTanahs(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getTanahById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchTanahs(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countTanahs())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
