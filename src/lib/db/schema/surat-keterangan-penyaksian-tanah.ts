import { createCustomId } from "@/lib/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratKeteranganPenyaksianTanahTable = pgTable(
  "surat_keterangan_penyaksian_tanah",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    pemohonNIK: text("pemohon_nik")
      .notNull()
      .references(() => pendudukTable.id, { onDelete: "cascade" }),
    keperluan: text("keperluan").notNull(),
    jenisTanah: text("jenis_tanah").notNull(),
    lokasiTanah: text("lokasi_tanah").notNull(),
    luasTanah: text("luas_tanah").notNull(),
    batasUtara: text("batas_utara").notNull(),
    batasSelatan: text("batas_selatan").notNull(),
    batasTimur: text("batas_timur").notNull(),
    batasBarat: text("batas_barat").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratKeteranganPenyaksianTanahRelations = relations(
  suratKeteranganPenyaksianTanahTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganPenyaksianTanahTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganPenyaksianTanahSchema = createInsertSchema(
  suratKeteranganPenyaksianTanahTable,
)
export const updateSuratKeteranganPenyaksianTanahSchema = createUpdateSchema(
  suratKeteranganPenyaksianTanahTable,
)

export type SelectSuratKeteranganPenyaksianTanah =
  typeof suratKeteranganPenyaksianTanahTable.$inferSelect
export type InsertSuratKeteranganPenyaksianTanah =
  typeof suratKeteranganPenyaksianTanahTable.$inferInsert
