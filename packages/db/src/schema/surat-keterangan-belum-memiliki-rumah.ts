import { createCustomId } from "@pintudesa/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratKeteranganBelumMemilikiRumahTable = pgTable(
  "surat_keterangan_belum_memiliki_rumah",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    pemohonNIK: text("pemohon_nik")
      .notNull()
      .references(() => pendudukTable.id, {
        onDelete: "cascade",
      }),
    tujuanPembuatan: text("tujuan_pembuatan").notNull(),
    tempatTinggalSekarang: text("tempat_tinggal_sekarang").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratKeteranganBelumMemilikiRumahRelations = relations(
  suratKeteranganBelumMemilikiRumahTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganBelumMemilikiRumahTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganBelumMemilikiRumahSchema = createInsertSchema(
  suratKeteranganBelumMemilikiRumahTable,
)
export const updateSuratKeteranganBelumMemilikiRumahSchema = createUpdateSchema(
  suratKeteranganBelumMemilikiRumahTable,
)

export type SelectSuratKeteranganBelumMemilikiRumah =
  typeof suratKeteranganBelumMemilikiRumahTable.$inferSelect
export type InsertSuratKeteranganBelumMemilikiRumah =
  typeof suratKeteranganBelumMemilikiRumahTable.$inferInsert
