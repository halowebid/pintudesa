import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganBelumMemilikiRumahContent = dynamicFn(async () => {
  const SuratKeteranganBelumMemilikiRumahContent = await import("./content")
  return SuratKeteranganBelumMemilikiRumahContent
})

export const metadata = {
  title: "Surat Keterangan Belum Memiliki Rumah",
}

export default function SuratKeteranganBelumMemilikiRumahPage() {
  prefetch(
    trpc.suratKeteranganBelumMemilikiRumah.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganBelumMemilikiRumah.count.queryOptions())

  return <SuratKeteranganBelumMemilikiRumahContent />
}
