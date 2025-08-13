import { agendaRouter } from "./routes/agenda"
import { anggotaKeluargaRouter } from "./routes/anggota-keluarga"
import { authRouter } from "./routes/auth"
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
import { settingRouter } from "./routes/setting"
import { suratIzinKeramaianRouter } from "./routes/surat-izin-keramaian"
import { suratIzinMendirikanBangunanRouter } from "./routes/surat-izin-mendirikan-bangunan"
import { suratKeteranganDomisiliRouter } from "./routes/surat-keterangan-domisili"
import { suratKeteranganKelahiranRouter } from "./routes/surat-keterangan-kelahiran"
import { suratKeteranganKematianRouter } from "./routes/surat-keterangan-kematian"
import { suratKeteranganKepemilikanRumahRouter } from "./routes/surat-keterangan-kepemilikan-rumah"
import { suratKuasaAhliWarisRouter } from "./routes/surat-kuasa-ahli-waris"
import { suratKuasaSKGRRouter } from "./routes/surat-kuasa-skgr"
import { suratPengantarSKCKRouter } from "./routes/surat-pengantar-skck"
import { suratPernyataanBelumMenikahRouter } from "./routes/surat-pernyataan-belum-menikah"
import { tanahRouter } from "./routes/tanah"
import { tanahKasRouter } from "./routes/tanah-kas"
import { userRouter } from "./routes/user"
import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc"

export const appRouter = createTRPCRouter({
  healthCheck: publicProcedure.query(() => "ok"),
  auth: authRouter,

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
  setting: settingRouter,
  suratIzinKeramaian: suratIzinKeramaianRouter,
  suratIzinMendirikanBangunan: suratIzinMendirikanBangunanRouter,
  suratKeteranganDomisili: suratKeteranganDomisiliRouter,
  suratKeteranganKelahiran: suratKeteranganKelahiranRouter,
  suratKeteranganKematian: suratKeteranganKematianRouter,
  suratKeteranganKepemilikanRumah: suratKeteranganKepemilikanRumahRouter,
  suratKuasaAhliWaris: suratKuasaAhliWarisRouter,
  suratKuasaSKGR: suratKuasaSKGRRouter,
  suratPengantarSKCK: suratPengantarSKCKRouter,
  suratPernyataanBelumMenikah: suratPernyataanBelumMenikahRouter,
  tanah: tanahRouter,
  tanahKas: tanahKasRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
