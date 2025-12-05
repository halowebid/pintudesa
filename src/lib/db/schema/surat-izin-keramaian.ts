import { createCustomId } from "@/lib/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratIzinKeramaianTable = pgTable("surat_izin_keramaian", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  pemohonNIK: text("pemohon_nik")
    .notNull()
    .references(() => pendudukTable.id, {
      onDelete: "cascade",
    }),
  tujuanPembuatan: text("tujuan_pembuatan").notNull(),
  waktuAcara: timestamp("waktu_acara", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  waktuSelesai: timestamp("waktu_selesai", {
    withTimezone: true,
    mode: "date",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const suratIzinKeramaianRelations = relations(
  suratIzinKeramaianTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratIzinKeramaianTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratIzinKeramaianSchema = createInsertSchema(
  suratIzinKeramaianTable,
)
export const updateSuratIzinKeramaianSchema = createUpdateSchema(
  suratIzinKeramaianTable,
)

export type SelectSuratIzinKeramaian =
  typeof suratIzinKeramaianTable.$inferSelect
export type InsertSuratIzinKeramaian =
  typeof suratIzinKeramaianTable.$inferInsert
