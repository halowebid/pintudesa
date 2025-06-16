import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertKaderPemberdayaanMasyarakatSchema,
  updateKaderPemberdayaanMasyarakatSchema,
  type SelectKaderPemberdayaanMasyarakat,
} from "@/lib/db/schema/kader-pemberdayaan-masyarakat"
import {
  countKaderPemberdayaanMasyarakats,
  deleteKaderPemberdayaanMasyarakat,
  getKaderPemberdayaanMasyarakatById,
  getKaderPemberdayaanMasyarakats,
  insertKaderPemberdayaanMasyarakat,
  searchKaderPemberdayaanMasyarakats,
  updateKaderPemberdayaanMasyarakat,
} from "@/lib/db/service/kader-pemberdayaan-masyarakat"

export const kaderPemberdayaanMasyarakatRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertKaderPemberdayaanMasyarakatSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        insertKaderPemberdayaanMasyarakat(input),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting kaderPemberdayaanMasyarakat",
        })
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting kaderPemberdayaanMasyarakat",
        })
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting kaderPemberdayaanMasyarakat",
        })
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching kaderPemberdayaanMasyarakats",
        })
      }
      return data
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(
      getKaderPemberdayaanMasyarakatById(input),
    )
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching kaderPemberdayaanMasyarakat by ID",
      })
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching kaderPemberdayaanMasyarakats",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countKaderPemberdayaanMasyarakats())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting kaderPemberdayaanMasyarakats",
      })
    }
    return data
  }),
})
