import {
  countLembarans,
  deleteLembaran,
  getLembaranById,
  getLembarans,
  insertLembaran,
  insertLembaranSchema,
  searchLembarans,
  updateLembaran,
  updateLembaranSchema,
  type SelectLembaran,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const lembaranRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertLembaranSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertLembaran(input))
      if (error) {
        handleTRPCError(error)
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
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteLembaran(input))
      if (error) {
        handleTRPCError(error)
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
        handleTRPCError(error)
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getLembaranById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchLembarans(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countLembarans())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
