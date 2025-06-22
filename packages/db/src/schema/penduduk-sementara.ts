import { createCustomId } from "@pintudesa/utils"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { jenisKelaminEnum } from "./jenis-kelamin"
import { jenisPekerjaanEnum } from "./jenis-pekerjaan"
import { kebangsaanEnum } from "./kebangsaan"

export const pendudukSementaraTable = pgTable("penduduk_sementara", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  nama: text("nama").notNull(),
  nomorIndentitas: text("nomor_identitas").notNull(),
  jenisKelamin: jenisKelaminEnum("jenis_kelamin").notNull(),
  tempatLahir: text("tempat_lahir").notNull(),
  tanggalLahir: timestamp("tanggal_lahir").notNull(),
  pekerjaan: jenisPekerjaanEnum("pekerjaan").notNull(),
  kebangsaan: kebangsaanEnum("kebangsaan").notNull(),
  keturunan: text("keturunan"),
  datangDari: text("datang_dari").notNull(),
  tujuanKedatangan: text("tujuan_kedatangan").notNull(),
  namaYangDidatangi: text("nama_yang_didatangi").notNull(),
  alamatYangDidatangi: text("alamat_yang_didatangi").notNull(),
  tanggalDatang: timestamp("tanggal_datang", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  tanggalPergi: timestamp("tanggal_pergi", {
    withTimezone: true,
    mode: "date",
  }),
  keteranganTambahan: text("keterangan_tambahan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertPendudukSementaraSchema = createInsertSchema(
  pendudukSementaraTable,
)
export const updatePendudukSementaraSchema = createUpdateSchema(
  pendudukSementaraTable,
)

export type SelectPendudukSementara = typeof pendudukSementaraTable.$inferSelect
export type InsertPendudukSementara = typeof pendudukSementaraTable.$inferInsert
