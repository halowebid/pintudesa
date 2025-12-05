import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"
import { shdkEnum } from "./anggota-keluarga"
import { pendudukTable } from "./penduduk"

export const suratKuasaAhliWarisTable = pgTable("surat_kuasa_ahli_waris", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  pemohonNIK: text("pemohon_nik")
    .notNull()
    .references(() => pendudukTable.id, {
      onDelete: "cascade",
    }),
  yangDiberiKuasaNama: text("yang_diberi_kuasa_nama").notNull(),
  yangDiberiKuasaTempatLahir: text("yang_diberi_kuasa_tempat_lahir").notNull(),
  yangDiberiKuasaTanggalLahir: timestamp({
    withTimezone: true,
    mode: "date",
  }).notNull(),
  hubunganKeluarga: shdkEnum("hubungan_keluarga"),
  yangDiberiKuasaAlamat: text("yang_diberi_kuasa_alamat").notNull(),
  yangDiberiKuasaAlamatWilayah: text("yang_diberi_kuasa_alamat_wilayah"),
  yangMeninggalNIK: text("yang_meninggal_nik")
    .notNull()
    .references(() => pendudukTable.id),
  tanggalMeninggal: timestamp({ withTimezone: true, mode: "date" }).notNull(),
  lokasiMeninggal: text("lokasi_meninggal").notNull(),
  lokasiPemakaman: text("lokasi_pemakaman").notNull(),
  tanggalPemakaman: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .notNull(),
  nomorSuratKematian: text("nomor_surat_kematian"),
  tanggalSuratKematian: timestamp({ withTimezone: true, mode: "date" }),
  ahaliWarisNIK: text("ahli_waris_nik"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const suratKuasaAhliWarisRelations = relations(
  suratKuasaAhliWarisTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKuasaAhliWarisTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKuasaAhliWarisSchema = createInsertSchema(
  suratKuasaAhliWarisTable,
)
export const updateSuratKuasaAhliWarisSchema = createUpdateSchema(
  suratKuasaAhliWarisTable,
)

export type SelectSuratKuasaAhliWaris =
  typeof suratKuasaAhliWarisTable.$inferSelect
export type InsertSuratKuasaAhliWaris =
  typeof suratKuasaAhliWarisTable.$inferInsert
