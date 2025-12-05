import {
  countSuratPindahDesaBpns,
  deleteSuratPindahDesaBpn,
  getSuratPindahDesaBpnById,
  getSuratPindahDesaBpns,
  insertSuratPindahDesaBpn,
  insertSuratPindahDesaBpnSchema,
  searchSuratPindahDesaBpns,
  updateSuratPindahDesaBpn,
  updateSuratPindahDesaBpnSchema,
  type SelectSuratPindahDesaBpn,
} from "@/lib/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratPindahDesaBpnRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratPindahDesaBpnSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratPindahDesaBpn(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratPindahDesaBpnSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratPindahDesaBpn(input as SelectSuratPindahDesaBpn),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratPindahDesaBpn(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratPindahDesaBpns(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSuratPindahDesaBpnById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchSuratPindahDesaBpns(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratPindahDesaBpns())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
