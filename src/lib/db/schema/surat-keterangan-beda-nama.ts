import { createCustomId } from "@/lib/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

/**
 * Surat Keterangan Beda Nama table
 * Stores certificate of different name letters for village residents who have name discrepancies
 */
export const suratKeteranganBedaNamaTable = pgTable(
  "surat_keterangan_beda_nama",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    tujuanPembuatan: text("tujuan_pembuatan").notNull(),
    namaLain: text("nama_lain").notNull(),
    pemohonNik: text("pemohon_nik")
      .notNull()
      .references(() => pendudukTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratKeteranganBedaNamaRelations = relations(
  suratKeteranganBedaNamaTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganBedaNamaTable.pemohonNik],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganBedaNamaSchema = createInsertSchema(
  suratKeteranganBedaNamaTable,
)
export const updateSuratKeteranganBedaNamaSchema = createUpdateSchema(
  suratKeteranganBedaNamaTable,
)

export type SelectSuratKeteranganBedaNama =
  typeof suratKeteranganBedaNamaTable.$inferSelect
export type InsertSuratKeteranganBedaNama =
  typeof suratKeteranganBedaNamaTable.$inferInsert
