import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  countKeputusanKepalaDesas,
  deleteKeputusanKepalaDesa,
  getKeputusanKepalaDesaById,
  getKeputusanKepalaDesas,
  insertKeputusanKepalaDesa,
  insertKeputusanKepalaDesaSchema,
  searchKeputusanKepalaDesas,
  updateKeputusanKepalaDesa,
  updateKeputusanKepalaDesaSchema,
  type SelectKeputusanKepalaDesa,
} from "@/lib/db"
import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const keputusanKepalaDesaRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertKeputusanKepalaDesaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertKeputusanKepalaDesa(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateKeputusanKepalaDesaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateKeputusanKepalaDesa(input as SelectKeputusanKepalaDesa),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteKeputusanKepalaDesa(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getKeputusanKepalaDesas(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getKeputusanKepalaDesaById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchKeputusanKepalaDesas(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countKeputusanKepalaDesas())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
