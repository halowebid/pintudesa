import {
  countBeritas,
  deleteBerita,
  getBeritaById,
  getBeritas,
  insertBerita,
  insertBeritaSchema,
  searchBeritas,
  updateBerita,
  updateBeritaSchema,
  type SelectBerita,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const beritaRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertBeritaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertBerita(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateBeritaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateBerita(input as SelectBerita),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteBerita(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getBeritas(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getBeritaById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchBeritas(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countBeritas())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
