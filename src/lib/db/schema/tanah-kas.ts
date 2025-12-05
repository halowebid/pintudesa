import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"

export const tanahKasTable = pgTable("tanah_kas", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  asal: text("asal").notNull(),
  nomorSertifikat: text("nomor_sertifikat").notNull(),
  luasTanah: integer("luas_tanah").notNull(),
  kelasTanah: text("kelas_tanah").notNull(),
  milikDesa: integer("milik_desa"),
  milikPemerintah: integer("milik_pemerintah"),
  milikProvinsi: integer("milik_provinsi"),
  milikKabupatenAtauKota: integer("milik_kabupaten_atau_kota"),
  milikLainnya: integer("milik_lainnya"),
  tanahSawa: integer("tanah_sawah"),
  tanahTegal: integer("tanah_tegal"),
  tanahKebun: integer("tanah_kebun"),
  tanahTambak: integer("tanah_tambak"),
  tanahKering: integer("tanah_kering"),
  tanahPatok: integer("tanah_patok"),
  tanahTidakPatok: integer("tanah_tidak_patok"),
  lokasi: text("lokasi").notNull(),
  mutasi: text("mutasi"),
  keteranganTambahan: text("keterangan_tambahan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertTanahKasSchema = createInsertSchema(tanahKasTable)
export const updateTanahKasSchema = createUpdateSchema(tanahKasTable)

export type SelectTanahKas = typeof tanahKasTable.$inferSelect
export type InsertTanahKas = typeof tanahKasTable.$inferInsert
