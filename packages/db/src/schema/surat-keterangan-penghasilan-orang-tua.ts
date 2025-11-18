import { createCustomId } from "@pintudesa/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratKeteranganPenghasilanOrangTuaTable = pgTable(
  "surat_keterangan_penghasilan_orang_tua",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    pemohonNIK: text("pemohon_nik")
      .notNull()
      .references(() => pendudukTable.id, { onDelete: "cascade" }),
    NIKAyah: text("nik_ayah").notNull(),
    NIKIbu: text("nik_ibu").notNull(),
    tujuanPembuatan: text("tujuan_pembuatan").notNull(),
    namaSekolahAtauUniversitas: text("nama_sekolah_atau_universitas").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratKeteranganPenghasilanOrangTuaRelations = relations(
  suratKeteranganPenghasilanOrangTuaTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganPenghasilanOrangTuaTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganPenghasilanOrangTuaSchema =
  createInsertSchema(suratKeteranganPenghasilanOrangTuaTable)
export const updateSuratKeteranganPenghasilanOrangTuaSchema =
  createUpdateSchema(suratKeteranganPenghasilanOrangTuaTable)

export type SelectSuratKeteranganPenghasilanOrangTua =
  typeof suratKeteranganPenghasilanOrangTuaTable.$inferSelect
export type InsertSuratKeteranganPenghasilanOrangTua =
  typeof suratKeteranganPenghasilanOrangTuaTable.$inferInsert
