import { agendaRouter } from "./routes/agenda"
import { anggotaKeluargaRouter } from "./routes/anggota-keluarga"
import { beritaRouter } from "./routes/berita"
import { ekspedisiRouter } from "./routes/ekspedisi"
import { inventarisRouter } from "./routes/inventaris"
import { inventarisHasilPembangunanRouter } from "./routes/inventaris-hasil-pembangunan"
import { kaderPemberdayaanMasyarakatRouter } from "./routes/kader-pemberdayaan-masyarakat"
import { kartuKeluargaRouter } from "./routes/kartu-keluarga"
import { kegiatanPembangunanRouter } from "./routes/kegiatan-pembangunan"
import { keputusanKepalaDesaRouter } from "./routes/keputusan-kepala-desa"
import { lembaranRouter } from "./routes/lembaran"
import { pendudukRouter } from "./routes/penduduk"
import { pendudukSementaraRouter } from "./routes/penduduk-sementara"
import { peraturanRouter } from "./routes/peraturan"
import { rabRouter } from "./routes/rab"
import { rencanaKerjaPembangunanRouter } from "./routes/rencana-kerja-pembangunan"
import { suratKeteranganKelahiranRouter } from "./routes/surat-keterangan-kelahiran"
import { suratKeteranganKematianRouter } from "./routes/surat-keterangan-kematian"
import { suratKuasaSKGRRouter } from "./routes/surat-kuasa-skgr"
import { suratPernyataanBelumMenikahRouter } from "./routes/surat-pernyataan-belum-menikah"
import { tanahRouter } from "./routes/tanah"
import { tanahKasRouter } from "./routes/tanah-kas"
import { userRouter } from "./routes/user"
import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc"

export const appRouter = createTRPCRouter({
  heatlhCheck: publicProcedure.query(() => "ok"),

  // Routers
  agenda: agendaRouter,
  anggotaKeluarga: anggotaKeluargaRouter,
  berita: beritaRouter,
  ekspedisi: ekspedisiRouter,
  inventaris: inventarisRouter,
  inventarisHasilPembangunan: inventarisHasilPembangunanRouter,
  kaderPemberdayaanMasyarakat: kaderPemberdayaanMasyarakatRouter,
  kartuKeluarga: kartuKeluargaRouter,
  kegiatanPembangunan: kegiatanPembangunanRouter,
  keputusanKepalaDesa: keputusanKepalaDesaRouter,
  lembaran: lembaranRouter,
  penduduk: pendudukRouter,
  pendudukSementara: pendudukSementaraRouter,
  peraturan: peraturanRouter,
  rab: rabRouter,
  rencanaKerjaPembangunan: rencanaKerjaPembangunanRouter,
  suratKeteranganKelahiran: suratKeteranganKelahiranRouter,
  suratKeteranganKematian: suratKeteranganKematianRouter,
  suratKuasaSKGR: suratKuasaSKGRRouter,
  suratPernyataanBelumMenikah: suratPernyataanBelumMenikahRouter,
  tanah: tanahRouter,
  tanahKas: tanahKasRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
