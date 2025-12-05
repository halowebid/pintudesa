import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"
import { jenisKelaminEnum } from "./jenis-kelamin"

export const kaderPemberdayaanMasyarakatTable = pgTable(
  "kader_pemberdayaan_masyarakat",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    nama: text("nama").notNull(),
    umur: text("umur").notNull(),
    jenisKelamin: jenisKelaminEnum("jenis_kelamin").notNull(),
    pendidikan: text("pendidikan").notNull(),
    bidang: text("bidang").notNull(),
    alamat: text("alamat").notNull(),
    keteranganTambahan: text("keterangan_tambahan"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const insertKaderPemberdayaanMasyarakatSchema = createInsertSchema(
  kaderPemberdayaanMasyarakatTable,
)
export const updateKaderPemberdayaanMasyarakatSchema = createUpdateSchema(
  kaderPemberdayaanMasyarakatTable,
)

export type SelectKaderPemberdayaanMasyarakat =
  typeof kaderPemberdayaanMasyarakatTable.$inferSelect
export type InsertKaderPemberdayaanMasyarakat =
  typeof kaderPemberdayaanMasyarakatTable.$inferInsert
