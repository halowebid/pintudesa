import {
  countRABs,
  deleteRAB,
  getRABById,
  getRABs,
  insertRAB,
  insertRABSchema,
  searchRABs,
  updateRAB,
  updateRABSchema,
  type SelectRAB,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const rabRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertRABSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertRAB(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateRABSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(updateRAB(input as SelectRAB))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteRAB(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getRABs(input.page, input.perPage))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getRABById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchRABs(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countRABs())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
