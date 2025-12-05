import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  countPendudukSementaras,
  deletePendudukSementara,
  getPendudukSementaraById,
  getPendudukSementaras,
  insertPendudukSementara,
  insertPendudukSementaraSchema,
  searchPendudukSementaras,
  updatePendudukSementara,
  updatePendudukSementaraSchema,
  type SelectPendudukSementara,
} from "@/lib/db"
import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const pendudukSementaraRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertPendudukSementaraSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertPendudukSementara(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updatePendudukSementaraSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updatePendudukSementara(input as SelectPendudukSementara),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deletePendudukSementara(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getPendudukSementaras(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getPendudukSementaraById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchPendudukSementaras(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countPendudukSementaras())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
