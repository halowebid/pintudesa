import {
  deleteSetting,
  getSettingById,
  getSettingByKey,
  getSettings,
  insertSetting,
  insertSettingSchema,
  updateSetting,
  updateSettingSchema,
  upsertSetting,
  type SelectSetting,
} from "@pintudesa/db"
import { redisUrl } from "@pintudesa/env"
import { tryCatch } from "@yopem/try-catch"
import Redis from "ioredis"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

const redis = new Redis(redisUrl!)

export const settingRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSettingSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSetting(input))
      if (error) {
        handleTRPCError(error)
      }
      if (input.key) {
        await redis.del(`setting:${input.key}`)
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
      if (input.key) {
        await redis.del(`setting:${input.key}`)
      }
      return data
    }),

  upsert: adminProtectedProcedure
    .input(insertSettingSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        upsertSetting(input as SelectSetting),
      )

      if (error) {
        handleTRPCError(error)
      }

      if (input.key) {
        await redis.del(`setting:${input.key}`)
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
      await redis.del(`setting:${input}`)
      return data
    }),

  all: adminProtectedProcedure.query(async () => {
    const { data, error } = await tryCatch(getSettings())
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
    const cacheKey = `setting:${input}`
    const cached = await redis.get(cacheKey)

    if (cached) {
      const parsedSetting = JSON.parse(cached) as SelectSetting
      return parsedSetting.value
    }

    const { data, error } = await tryCatch(getSettingByKey(input))

    if (error) {
      handleTRPCError(error)
    }

    if (data) {
      await redis.set(cacheKey, JSON.stringify(data), "EX", 60 * 5)
    }

    return data?.value
  }),
})
