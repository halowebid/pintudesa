import {
  countSuratPernyataanBelumMenikahs,
  deleteSuratPernyataanBelumMenikah,
  getSuratPernyataanBelumMenikahById,
  getSuratPernyataanBelumMenikahs,
  insertSuratPernyataanBelumMenikah,
  insertSuratPernyataanBelumMenikahSchema,
  searchSuratPernyataanBelumMenikahs,
  updateSuratPernyataanBelumMenikah,
  updateSuratPernyataanBelumMenikahSchema,
  type SelectSuratPernyataanBelumMenikah,
} from "@/lib/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratPernyataanBelumMenikahRouter = createTRPCRouter({
  create: staffProtectedProcedure
    .input(insertSuratPernyataanBelumMenikahSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertSuratPernyataanBelumMenikah(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: staffProtectedProcedure
    .input(updateSuratPernyataanBelumMenikahSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratPernyataanBelumMenikah(
          input as SelectSuratPernyataanBelumMenikah,
        ),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        deleteSuratPernyataanBelumMenikah(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratPernyataanBelumMenikahs(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getSuratPernyataanBelumMenikahById(input),
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
        searchSuratPernyataanBelumMenikahs(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratPernyataanBelumMenikahs())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
