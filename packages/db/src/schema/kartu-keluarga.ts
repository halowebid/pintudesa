import { createCustomId } from "@pintudesa/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { anggotaKeluargaTable } from "./anggota-keluarga"
import { kategoriPendudukEnum } from "./kategori-penduduk"

export const kartuKeluargaTable = pgTable("kartu_keluarga", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  kategoriPenduduk: kategoriPendudukEnum("kategori_penduduk").default(
    "penduduk_dalam_desa",
  ),
  nomorKartuKeluarga: text("nomor_kartu_keluarga").notNull(),
  alamat: text("alamat").notNull(),
  provisi: text("provinsi").notNull(),
  kabupaten_kota: text("kabupaten_kota").notNull(),
  kecamatan: text("kecamatan").notNull(),
  desa_kelurahan: text("desa_kelurahan").notNull(),
  dusun: text("dusun"),
  rt: text("rt").notNull(),
  rw: text("rw").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const kartuKeluargaRelations = relations(
  kartuKeluargaTable,
  ({ many }) => ({
    anggotaKeluarga: many(anggotaKeluargaTable),
  }),
)

export const insertKartuKeluargaSchema = createInsertSchema(kartuKeluargaTable)
export const updateKartuKeluargaSchema = createUpdateSchema(kartuKeluargaTable)

export type SelectKartuKeluarga = typeof kartuKeluargaTable.$inferSelect
export type InsertKartuKeluarga = typeof kartuKeluargaTable.$inferInsert
