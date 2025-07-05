import {
  deleteSetting,
  getSettingById,
  getSettingByKey,
  getSettings,
  insertSetting,
  insertSettingSchema,
  updateSetting,
  updateSettingSchema,
  type SelectSetting,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const settingRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSettingSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSetting(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateSettingSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSetting(input as SelectSetting),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSetting(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSettings(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSettingById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  byKey: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSettingByKey(input))
    if (error) {
      handleTRPCError(error)
    }
    return data ?? null
  }),
})
