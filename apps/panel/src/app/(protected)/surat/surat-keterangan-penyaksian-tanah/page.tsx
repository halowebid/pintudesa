import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganPenyaksianTanahContent = dynamicFn(async () => {
  const SuratKeteranganPenyaksianTanahContent = await import("./content")
  return SuratKeteranganPenyaksianTanahContent
})

export const metadata = {
  title: "Surat Keterangan Penyaksian Tanah",
}

export default function SuratKeteranganPenyaksianTanahPage() {
  prefetch(
    trpc.suratKeteranganPenyaksianTanah.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganPenyaksianTanah.count.queryOptions())

  return <SuratKeteranganPenyaksianTanahContent />
}
