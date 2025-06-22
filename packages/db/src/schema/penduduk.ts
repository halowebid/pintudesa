import { createCustomId } from "@pintudesa/utils"
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import z from "zod"

import { jenisKelaminEnum } from "./jenis-kelamin"
import { jenisPekerjaanEnum } from "./jenis-pekerjaan"

export const AGAMA = [
  "islam",
  "kristen",
  "katolik",
  "hindu",
  "budha",
  "konghucu",
  "penghayat_kepercayaan",
] as const
export const ASAL_PENDUDUK = ["penduduk_desa", "penduduk_luar_desa"] as const
export const PENDIDIKAN_TERAKHIR = [
  "tidak_atau_belum_sekolah",
  "belum_tamat_sd",
  "sd",
  "sltp",
  "slta",
  "d1_d2",
  "akademi_d3_s_muda",
  "s1_d4",
  "s2",
  "s3",
] as const
export const STATUS_DOMISILI = [
  "ktp_beralamat_di_desa_berdomisili_di_desa",
  "ktp_beralamat_di_luar_desa_berdomisili_di_desa",
  "ktp_beralamat_di_desa_berdomisili_di_luar_desa",
  "ktp_beralamat_di_luar_desa_berdomisili_di_luar_desa",
  "tidak_domisili",
] as const
export const STATUS_PENDUDUK = ["hidup", "meninggal", "tidak_aktif"] as const
export const STATUS_PERKAWINAN = [
  "belum_kawin",
  "kawin_tercatat",
  "kawin_belum_tercatat",
  "cerai_hidup",
  "cerai_mati",
] as const

export const agama = z.enum(AGAMA)
export const asalPenduduk = z.enum(ASAL_PENDUDUK)
export const pendidikanTerakhir = z.enum(PENDIDIKAN_TERAKHIR)
export const statusDomisili = z.enum(STATUS_DOMISILI)
export const statusPenduduk = z.enum(STATUS_PENDUDUK)
export const statusPerkawinan = z.enum(STATUS_PERKAWINAN)

export const agamaEnum = pgEnum("agama", AGAMA)
export const asalPendudukEnum = pgEnum("asal_penduduk", ASAL_PENDUDUK)
export const pendidikanTerakhirEnum = pgEnum(
  "pendidikan_terakhir",
  PENDIDIKAN_TERAKHIR,
)
export const statusDomisiliEnum = pgEnum("status_domisili", STATUS_DOMISILI)
export const statusPendudukEnum = pgEnum("status_penduduk", STATUS_PENDUDUK)
export const statusPerkawinanEnum = pgEnum(
  "status_perkawinan",
  STATUS_PERKAWINAN,
)

export const pendudukTable = pgTable("penduduk", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  asalPenduduk: asalPendudukEnum("asal_penduduk").default("penduduk_desa"),
  provinsi: text("provinsi").notNull(),
  kabupaten_kota: text("kabupaten_kota").notNull(),
  kecamatan: text("kecamatan").notNull(),
  desa_kelurahan: text("desa_kelurahan").notNull(),
  dusun: text("dusun"),
  rt: text("rt").notNull(),
  rw: text("rw").notNull(),
  alamat: text("alamat").notNull(),
  nik: text("nik").notNull(),
  namaLengkap: text("nama_lengkap").notNull(),
  agama: agamaEnum("agama").notNull(),
  pendidikanTerakhir: pendidikanTerakhirEnum("pendidikan_terakhir").notNull(),
  pekerjaan: jenisPekerjaanEnum("pekerjaan").notNull(),
  jenisKelamin: jenisKelaminEnum("jenis_kelamin").notNull(),
  tempatLahir: text("tempat_lahir").notNull(),
  tanggalLahir: timestamp("tanggal_lahir", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  statusPerkawinan: statusPerkawinanEnum("status_perkawinan").notNull(),
  statusDomisili: statusDomisiliEnum("status_domisili").notNull(),
  namaAyahKandung: text("nama_ayah_kandung").notNull(),
  namaIbuKandung: text("nama_ibu_kandung").notNull(),
  statusPenduduk: statusPendudukEnum("status_penduduk").default("hidup"),
  bantuanSosial: boolean("bantuan_sosial").notNull().default(false),
  disabilitas: boolean("disabilitas").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertPendudukSchema = createInsertSchema(pendudukTable)
export const updatePendudukSchema = createUpdateSchema(pendudukTable)

export type SelectPenduduk = typeof pendudukTable.$inferSelect
export type InsertPenduduk = typeof pendudukTable.$inferInsert

export type Agama = z.infer<typeof agama>
export type AsalPenduduk = z.infer<typeof asalPenduduk>
export type PendidikanTerakhir = z.infer<typeof pendidikanTerakhir>
export type StatusDomisili = z.infer<typeof statusDomisili>
export type StatusPenduduk = z.infer<typeof statusPenduduk>
export type StatusPerkawinan = z.infer<typeof statusPerkawinan>
