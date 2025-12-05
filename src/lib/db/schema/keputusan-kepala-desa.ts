import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"

export const keputusanKepalaDesaTable = pgTable("keputusan_kepala_desa", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  nomorSurat: text("nomor_surat").notNull(),
  tanggalSurat: timestamp("tanggal_surat", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  judul: text("judul").notNull(),
  uraian: text("uraian").notNull(),
  nomorLaporan: text("nomor_laporan").notNull(),
  tanggalLaporan: timestamp("tanggal_laporan", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  keteranganTambahan: text("keterangan_tambahan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertKeputusanKepalaDesaSchema = createInsertSchema(
  keputusanKepalaDesaTable,
)
export const updateKeputusanKepalaDesaSchema = createUpdateSchema(
  keputusanKepalaDesaTable,
)

export type SelectKeputusanKepalaDesa =
  typeof keputusanKepalaDesaTable.$inferSelect
export type InsertKeputusanKepalaDesa =
  typeof keputusanKepalaDesaTable.$inferInsert
