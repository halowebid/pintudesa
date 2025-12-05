import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"
import { pendudukTable } from "./penduduk"

/**
 * Surat Keterangan Usaha table
 * Stores business certificate letters for village residents who own or operate businesses
 */
export const suratKeteranganUsahaTable = pgTable("surat_keterangan_usaha", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  bidangUsaha: text("bidang_usaha").notNull(),
  merkUsaha: text("merk_usaha").notNull(),
  alamatUsaha: text("alamat_usaha").notNull(),
  berdasarkan: text().notNull(),
  pemohonNik: text("pemohon_nik")
    .notNull()
    .references(() => pendudukTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const suratKeteranganUsahaRelations = relations(
  suratKeteranganUsahaTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganUsahaTable.pemohonNik],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganUsahaSchema = createInsertSchema(
  suratKeteranganUsahaTable,
)
export const updateSuratKeteranganUsahaSchema = createUpdateSchema(
  suratKeteranganUsahaTable,
)

export type SelectSuratKeteranganUsaha =
  typeof suratKeteranganUsahaTable.$inferSelect
export type InsertSuratKeteranganUsaha =
  typeof suratKeteranganUsahaTable.$inferInsert
