import { createCustomId } from "@/lib/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { jenisKelaminEnum } from "./jenis-kelamin"
import { jenisPekerjaanEnum } from "./jenis-pekerjaan"
import { pendudukTable } from "./penduduk"

export const suratKeteranganKelahiranTable = pgTable(
  "surat_keterangan_kelahiran",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    namaAnak: text("nama_anak").notNull(),
    tempatLahirAnak: text("tempat_lahir_anak").notNull(),
    tanggalLahirAnak: timestamp("tanggal_lahir_anak", {
      withTimezone: true,
      mode: "date",
    }),
    jenisKelaminAnak: jenisKelaminEnum("jenis_kelamin_anak").notNull(),
    nikAyah: text("nik_ayah").notNull(),
    namaAyah: text("nama_ayah").notNull(),
    tempatLahirAyah: text("tempat_lahir_ayah").notNull(),
    tanggalLahirAyah: timestamp("tanggal_lahir_ayah", {
      withTimezone: true,
      mode: "date",
    }),
    pekerjaanAyah: jenisPekerjaanEnum("pekerjaan_ayah").notNull(),
    alamatAyah: text("alamat_ayah").notNull(),
    alamatWilayahAyah: text("alamat_wilayah_ayah").notNull(),
    nikIbu: text("nik_ibu").notNull(),
    namaIbu: text("nama_ibu").notNull(),
    tempatLahirIbu: text("tempat_lahir_ibu").notNull(),
    tanggalLahirIbu: timestamp("tanggal_lahir_ibu", {
      withTimezone: true,
      mode: "date",
    }),
    pekerjaanIbu: jenisPekerjaanEnum("pekerjaan_ibu").notNull(),
    alamatIbu: text("alamat_ibu").notNull(),
    alamatWilayahIbu: text("alamat_wilayah_ibu").notNull(),
    nikPemohon: text("nik_pemohon")
      .notNull()
      .references(() => pendudukTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratKeteranganKelahiranRelations = relations(
  suratKeteranganKelahiranTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganKelahiranTable.nikPemohon],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganKelahiranSchema = createInsertSchema(
  suratKeteranganKelahiranTable,
)
export const updateSuratKeteranganKelahiranSchema = createUpdateSchema(
  suratKeteranganKelahiranTable,
)

export type SelectSuratKeteranganKelahiran =
  typeof suratKeteranganKelahiranTable.$inferSelect
export type InsertSuratKeteranganKelahiran =
  typeof suratKeteranganKelahiranTable.$inferInsert
