import { adminRouter } from "./routes/admin"
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
import { notifikasiRouter } from "./routes/notifikasi"
import { pendudukRouter } from "./routes/penduduk"
import { pendudukSementaraRouter } from "./routes/penduduk-sementara"
import { peraturanRouter } from "./routes/peraturan"
import { rabRouter } from "./routes/rab"
import { rencanaKerjaPembangunanRouter } from "./routes/rencana-kerja-pembangunan"
import { settingRouter } from "./routes/setting"
import { statisticsRouter } from "./routes/statistics"
import { suratIzinKeramaianRouter } from "./routes/surat-izin-keramaian"
import { suratIzinMendirikanBangunanRouter } from "./routes/surat-izin-mendirikan-bangunan"
import { suratKeteranganBedaNamaRouter } from "./routes/surat-keterangan-beda-nama"
import { suratKeteranganBelumMemilikiRumahRouter } from "./routes/surat-keterangan-belum-memiliki-rumah"
import { suratKeteranganDomisiliRouter } from "./routes/surat-keterangan-domisili"
import { suratKeteranganDomisiliUsahaRouter } from "./routes/surat-keterangan-domisili-usaha"
import { suratKeteranganGaibRouter } from "./routes/surat-keterangan-gaib"
import { suratKeteranganJalanRouter } from "./routes/surat-keterangan-jalan"
import { suratKeteranganKelahiranRouter } from "./routes/surat-keterangan-kelahiran"
import { suratKeteranganKematianRouter } from "./routes/surat-keterangan-kematian"
import { suratKeteranganKepemilikanRumahRouter } from "./routes/surat-keterangan-kepemilikan-rumah"
import { suratKeteranganPenghasilanRouter } from "./routes/surat-keterangan-penghasilan"
import { suratKeteranganPenghasilanOrangTuaRouter } from "./routes/surat-keterangan-penghasilan-orang-tua"
import { suratKeteranganPenyaksianTanahRouter } from "./routes/surat-keterangan-penyaksian-tanah"
import { suratKeteranganUsahaRouter } from "./routes/surat-keterangan-usaha"
import { suratKuasaAhliWarisRouter } from "./routes/surat-kuasa-ahli-waris"
import { suratKuasaSKGRRouter } from "./routes/surat-kuasa-skgr"
import { suratPengantarSKCKRouter } from "./routes/surat-pengantar-skck"
import { suratPernyataanBelumMenikahRouter } from "./routes/surat-pernyataan-belum-menikah"
import { suratPindahDesaBpnRouter } from "./routes/surat-pindah-desa-bpn"
import { suratTemplateRouter } from "./routes/surat-template"
import { tanahRouter } from "./routes/tanah"
import { tanahKasRouter } from "./routes/tanah-kas"
import { userRouter } from "./routes/user"
import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc"

export const appRouter = createTRPCRouter({
  healthCheck: publicProcedure.query(() => "ok"),
  auth: authRouter,
  admin: adminRouter,
  statistics: statisticsRouter,

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
  notifikasi: notifikasiRouter,
  penduduk: pendudukRouter,
  pendudukSementara: pendudukSementaraRouter,
  peraturan: peraturanRouter,
  rab: rabRouter,
  rencanaKerjaPembangunan: rencanaKerjaPembangunanRouter,
  setting: settingRouter,
  suratIzinKeramaian: suratIzinKeramaianRouter,
  suratIzinMendirikanBangunan: suratIzinMendirikanBangunanRouter,
  suratKeteranganBedaNama: suratKeteranganBedaNamaRouter,
  suratKeteranganBelumMemilikiRumah: suratKeteranganBelumMemilikiRumahRouter,
  suratKeteranganDomisili: suratKeteranganDomisiliRouter,
  suratKeteranganDomisiliUsaha: suratKeteranganDomisiliUsahaRouter,
  suratKeteranganUsaha: suratKeteranganUsahaRouter,
  suratKeteranganGaib: suratKeteranganGaibRouter,
  suratKeteranganJalan: suratKeteranganJalanRouter,
  suratKeteranganKelahiran: suratKeteranganKelahiranRouter,
  suratKeteranganKematian: suratKeteranganKematianRouter,
  suratKeteranganKepemilikanRumah: suratKeteranganKepemilikanRumahRouter,
  suratKeteranganPenghasilan: suratKeteranganPenghasilanRouter,
  suratKeteranganPenyaksianTanah: suratKeteranganPenyaksianTanahRouter,
  suratKeteranganPnghasilanOrangTua: suratKeteranganPenghasilanOrangTuaRouter,
  suratKuasaAhliWaris: suratKuasaAhliWarisRouter,
  suratKuasaSKGR: suratKuasaSKGRRouter,
  suratPengantarSKCK: suratPengantarSKCKRouter,
  suratPernyataanBelumMenikah: suratPernyataanBelumMenikahRouter,
  suratPindahDesaBpn: suratPindahDesaBpnRouter,
  suratTemplate: suratTemplateRouter,
  tanah: tanahRouter,
  tanahKas: tanahKasRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
