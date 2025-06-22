import { pgEnum } from "drizzle-orm/pg-core"
import z from "zod"

export const KATEGORI_PENDUDUK = [
  "penduduk_dalam_desa",
  "penduduk_luar_desa",
  "penduduk_luar_berdomisili_di_desa",
] as const

export const kategoriPenduduk = z.enum(KATEGORI_PENDUDUK)

export const kategoriPendudukEnum = pgEnum(
  "kategori_penduduk",
  KATEGORI_PENDUDUK,
)

export type KategoriPenduduk = z.infer<typeof kategoriPenduduk>
