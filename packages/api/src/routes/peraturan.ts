import {
  countPeraturans,
  deletePeraturan,
  getPeraturanById,
  getPeraturans,
  insertPeraturan,
  insertPeraturanSchema,
  searchPeraturans,
  updatePeraturan,
  updatePeraturanSchema,
  type SelectPeraturan,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const peraturanRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertPeraturanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertPeraturan(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updatePeraturanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updatePeraturan(input as SelectPeraturan),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deletePeraturan(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getPeraturans(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getPeraturanById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchPeraturans(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countPeraturans())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
