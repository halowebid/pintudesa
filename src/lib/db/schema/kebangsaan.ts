import { pgEnum } from "drizzle-orm/pg-core"
import z from "zod"

export const KEBANGSAAN = ["wni", "wna"] as const

export const kebangsaan = z.enum(KEBANGSAAN)

export const kebangsaanEnum = pgEnum("kebangsaan", KEBANGSAAN)

export type Kebangsaan = z.infer<typeof kebangsaan>
