import {
  countKaderPemberdayaanMasyarakats,
  deleteKaderPemberdayaanMasyarakat,
  getKaderPemberdayaanMasyarakatById,
  getKaderPemberdayaanMasyarakats,
  insertKaderPemberdayaanMasyarakat,
  insertKaderPemberdayaanMasyarakatSchema,
  searchKaderPemberdayaanMasyarakats,
  updateKaderPemberdayaanMasyarakat,
  updateKaderPemberdayaanMasyarakatSchema,
  type SelectKaderPemberdayaanMasyarakat,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const kaderPemberdayaanMasyarakatRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertKaderPemberdayaanMasyarakatSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertKaderPemberdayaanMasyarakat(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateKaderPemberdayaanMasyarakatSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateKaderPemberdayaanMasyarakat(
          input as SelectKaderPemberdayaanMasyarakat,
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
        deleteKaderPemberdayaanMasyarakat(input),
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
        getKaderPemberdayaanMasyarakats(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getKaderPemberdayaanMasyarakatById(input),
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
        searchKaderPemberdayaanMasyarakats(input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countKaderPemberdayaanMasyarakats())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
