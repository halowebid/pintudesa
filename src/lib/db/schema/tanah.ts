import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"

export const tanahTable = pgTable("tanah", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  namaPemilik: text("nama_pemilik").notNull(),
  totalLuas: integer("total_luas").notNull(),
  hakMilik: text("hak_milik"),
  hakGunaBangunan: text("hak_guna_bangunan"),
  hakPakai: text("hak_pakai"),
  hakGunaUsaha: text("hak_guna_usaha"),
  hakPengelolaan: text("hak_pengelolaan"),
  hakMilikAdat: text("hak_milik_adat"),
  hakVIMilikPribumi: text("hak_vi_milik_pribumi"),
  tanahNegara: integer("tanah_negara"),
  perumahan: integer("perumahan"),
  perdaganganDanJasa: integer("perdagangan_dan_jasa"),
  perkantoran: integer("perkantoran"),
  industri: integer("industri"),
  fasilitasUmum: integer("fasilitas_umum"),
  sawah: integer("sawah"),
  tegalan: integer("tegalan"),
  perkebunan: integer("perkebunan"),
  peternakanPerikanan: integer("peternakan_perikanan"),
  hutanBelukar: integer("hutan_belukar"),
  hutanLebat: integer("hutan_lebat"),
  tanahKosong: integer("tanah_kosong"),
  lainLain: integer("lain_lain"),
  mutasi: integer("mutasi"),
  keteranganTambahan: text("keterangan_tambahan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertTanahSchema = createInsertSchema(tanahTable)
export const updateTanahSchema = createUpdateSchema(tanahTable)

export type SelectTanah = typeof tanahTable.$inferSelect
export type InsertTanah = typeof tanahTable.$inferInsert
