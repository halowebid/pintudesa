import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganPenghasilanOrangTuaContent = dynamicFn(async () => {
  const SuratKeteranganPenghasilanOrangTuaContent = await import("./content")
  return SuratKeteranganPenghasilanOrangTuaContent
})

export const metadata = {
  title: "Surat Keterangan Penghasilan Orang Tua",
}

export default function SuratKeteranganPenghasilanOrangTuaPage() {
  prefetch(
    trpc.suratKeteranganPnghasilanOrangTua.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganPnghasilanOrangTua.count.queryOptions())

  return <SuratKeteranganPenghasilanOrangTuaContent />
}
