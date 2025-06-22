import { pgEnum } from "drizzle-orm/pg-core"
import z from "zod"

export const JENIS_KELAMIN = ["laki-laki", "perempuan"] as const

export const jenisKelamin = z.enum(JENIS_KELAMIN)

export const jenisKelaminEnum = pgEnum("jenis_kelamin", JENIS_KELAMIN)

export type JenisKelamin = z.infer<typeof jenisKelamin>
