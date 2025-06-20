import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { agendaRouter } from "./routers/agenda"
import { anggotaKeluargaRouter } from "./routers/anggota-keluarga"
import { beritaRouter } from "./routers/berita"
import { ekspedisiRouter } from "./routers/ekspedisi"
import { inventarisRouter } from "./routers/inventaris"
import { inventarisHasilPembangunanRouter } from "./routers/inventaris-hasil-pembangunan"
import { kaderPemberdayaanMasyarakatRouter } from "./routers/kader-pemberdayaan-masyarakat"
import { kartuKeluargaRouter } from "./routers/kartu-keluarga"
import { kegiatanPembangunanRouter } from "./routers/kegiatan-pembangunan"
import { lembaranRouter } from "./routers/lembaran"
import { pendudukRouter } from "./routers/penduduk"
import { peraturanRouter } from "./routers/peraturan"
import { rabRouter } from "./routers/rab"
import { rencanaKerjaPembangunanRouter } from "./routers/rencana-kerja-pembangunan"
import { tanahRouter } from "./routers/tanah"
import { tanahKasRouter } from "./routers/tanah-kas"
import { userRouter } from "./routers/user"

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
  lembaran: lembaranRouter,
  penduduk: pendudukRouter,
  peraturan: peraturanRouter,
  rab: rabRouter,
  rencanaKerjaPembangunan: rencanaKerjaPembangunanRouter,
  tanah: tanahRouter,
  tanahKas: tanahKasRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
