import { createCustomId } from "@pintudesa/utils"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratKeteranganGaibTable = pgTable("surat_keterangan_gaib", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  pemohonNIK: text("pemohon_nik")
    .notNull()
    .references(() => pendudukTable.id, { onDelete: "cascade" }),
  pasangan: text("pemohon_nik")
    .notNull()
    .references(() => pendudukTable.id, { onDelete: "cascade" }),
  tanggalDitinggal: timestamp("tanggal_ditinggal", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertSuratKeteranganGaibSchema = createInsertSchema(
  suratKeteranganGaibTable,
)
export const updateSuratKeteranganGaibSchema = createUpdateSchema(
  suratKeteranganGaibTable,
)

export type SelectSuratKeteranganGaib =
  typeof suratKeteranganGaibTable.$inferSelect
export type InsertSuratKeteranganGaib =
  typeof suratKeteranganGaibTable.$inferInsert
