import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"
import { pendudukTable } from "./penduduk"

export const suratKeteranganJalanTable = pgTable("surat_keterangan_jalan", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  pemohonNIK: text("pemohon_nik")
    .notNull()
    .references(() => pendudukTable.id, { onDelete: "cascade" }),
  maksudPerjalanan: text("maksud_perjalanan").notNull(),
  tujuanPerjalanan: text("tujuan_perjalanan").notNull(),
  rencanaBerangkat: timestamp("rencana_berangkat", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  transportasi: text("transportasi").notNull(),
  noPlatKendaraan: text("no_plat_kendaraan").notNull(),
  namaSopir: text("nama_sopir").notNull(),
  tempatLahirSopir: text("tempat_lahir_sopir").notNull(),
  tanggalLahirSopir: timestamp("tanggal_lahir_sopir", {
    mode: "date",
    withTimezone: true,
  }),
  pengikut: text("pengikut"),
  barangBawaan: text("barang_bawaan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const suratKeteranganJalanRelations = relations(
  suratKeteranganJalanTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganJalanTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganJalanSchema = createInsertSchema(
  suratKeteranganJalanTable,
)
export const updateSuratKeteranganJalanSchema = createUpdateSchema(
  suratKeteranganJalanTable,
)

export type SelectSuratKeteranganJalan =
  typeof suratKeteranganJalanTable.$inferSelect
export type InsertSuratKeteranganJalan =
  typeof suratKeteranganJalanTable.$inferInsert
