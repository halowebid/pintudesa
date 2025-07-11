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
    const cacheKey = `setting:${input}`
    const cached = await redis.get(cacheKey)

    if (cached) {
      return typeof cached === "string" ? JSON.parse(cached) : cached
    }

    const { data, error } = await tryCatch(getSettingByKey(input))

    if (error) {
      handleTRPCError(error)
    }

    if (data) {
      if (typeof data === "object" && !Array.isArray(data)) {
        for (const [key, value] of Object.entries(data)) {
          await redis.set(`setting:${key}`, JSON.stringify(value), "EX", 60 * 5)
        }
      }
      await redis.set(cacheKey, JSON.stringify(data), "EX", 60 * 5)
    }

    return data ?? null
  }),
})
