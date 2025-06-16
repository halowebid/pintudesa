import { drizzle } from "drizzle-orm/node-postgres"

import { databaseUrl } from "@/lib/env/server"
import { agendaTable } from "./schema/agenda"
import { beritaTable } from "./schema/berita"
import { ekspedisiTable } from "./schema/ekspedisi"
import { inventarisTable } from "./schema/inventaris"
import { inventarisHasilPembangunanTable } from "./schema/inventaris-hasil-pembangunan"
import { jenisKelaminEnum } from "./schema/jenis-kelamin"
import { jenisPekerjaanEnum } from "./schema/jenis-pekerjaan"
import { kaderPemberdayaanMasyarakatTable } from "./schema/kader-pemberdayaan-masyarakat"
import { kategoriPendudukEnum } from "./schema/kategori-penduduk"
import { kebangsaanEnum } from "./schema/kebangsaan"
import { kegiatanPembangunanTable } from "./schema/kegiatan-pembangunan"
import { lembaranTable } from "./schema/lembaran"
import { pendudukSementaraTable } from "./schema/penduduk-sementara"
import { peraturanTable } from "./schema/peraturan"
import { rabTable } from "./schema/rab"
import { rencanaKerjaPembangunanTable } from "./schema/rencana-kerja-pembangunan"
import { tanahTable } from "./schema/tanah"
import { tanahKasTable } from "./schema/tanah-kas"
import { accountTable, sessionTable, userTable } from "./schema/user"

export const db = drizzle(databaseUrl, {
  schema: {
    // auth
    accountTable,
    sessionTable,
    userTable,
    // data
    agendaTable,
    beritaTable,
    ekspedisiTable,
    inventarisHasilPembangunanTable,
    inventarisTable,
    jenisKelaminEnum,
    jenisPekerjaanEnum,
    kaderPemberdayaanMasyarakatTable,
    kategoriPendudukEnum,
    kebangsaanEnum,
    kegiatanPembangunanTable,
    lembaranTable,
    pendudukSementaraTable,
    peraturanTable,
    rabTable,
    rencanaKerjaPembangunanTable,
    tanahKasTable,
    tanahTable,
  },
})
