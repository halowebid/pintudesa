import {
  countInventarisHasilPembangunans,
  deleteInventarisHasilPembangunan,
  getInventarisHasilPembangunanById,
  getInventarisHasilPembangunans,
  insertInventarisHasilPembangunan,
  insertInventarisHasilPembangunanSchema,
  searchInventarisHasilPembangunans,
  updateInventarisHasilPembangunan,
  updateInventarisHasilPembangunanSchema,
  type SelectInventarisHasilPembangunan,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const inventarisHasilPembangunanRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertInventarisHasilPembangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertInventarisHasilPembangunan(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateInventarisHasilPembangunanSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateInventarisHasilPembangunan(
          input as SelectInventarisHasilPembangunan,
        ),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        deleteInventarisHasilPembangunan(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getInventarisHasilPembangunans(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getInventarisHasilPembangunanById(input),
    )
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        searchInventarisHasilPembangunans(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countInventarisHasilPembangunans())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
