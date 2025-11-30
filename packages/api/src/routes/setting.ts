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

// Initialize Redis only if URL is provided and available
const redis = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) {
          // eslint-disable-next-line no-console
          console.warn("Redis connection failed, caching disabled")
          return null // Stop retrying
        }
        return Math.min(times * 100, 2000)
      },
    })
  : null

// Helper to safely use Redis cache
async function getCached(key: string): Promise<string | null> {
  if (!redis) return null
  try {
    return await redis.get(key)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Redis get failed:", error)
    return null
  }
}

async function setCached(
  key: string,
  value: string,
  ttl?: number,
): Promise<void> {
  if (!redis) return
  try {
    if (ttl) {
      await redis.set(key, value, "EX", ttl)
    } else {
      await redis.set(key, value)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Redis set failed:", error)
  }
}

async function delCached(key: string): Promise<void> {
  if (!redis) return
  try {
    await redis.del(key)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Redis del failed:", error)
  }
}

export const settingRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSettingSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSetting(input))
      if (error) {
        handleTRPCError(error)
      }
      if (input.key) {
        await delCached(`setting:${input.key}`)
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
        await delCached(`setting:${input.key}`)
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
        await delCached(`setting:${input.key}`)
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
      await delCached(`setting:${input}`)
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
    const cached = await getCached(cacheKey)

    if (cached) {
      const parsedSetting = JSON.parse(cached) as SelectSetting
      return parsedSetting.value
    }

    const { data, error } = await tryCatch(getSettingByKey(input))

    if (error) {
      handleTRPCError(error)
    }

    if (data) {
      await setCached(cacheKey, JSON.stringify(data), 60 * 5)
    }

    return data?.value
  }),
})
