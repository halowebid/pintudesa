import {
  countTanahKases,
  deleteTanahKas,
  getTanahKasById,
  getTanahKases,
  insertTanahKas,
  insertTanahKasSchema,
  searchTanahKases,
  updateTanahKas,
  updateTanahKasSchema,
  type SelectTanahKas,
} from "@/lib/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const tanahKasRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertTanahKasSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertTanahKas(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateTanahKasSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateTanahKas(input as SelectTanahKas),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteTanahKas(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getTanahKases(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getTanahKasById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchTanahKases(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countTanahKases())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
