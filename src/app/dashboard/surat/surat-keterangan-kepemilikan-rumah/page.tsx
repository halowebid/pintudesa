import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganKepemilikanRumahContent = dynamicFn(async () => {
  const SuratKeteranganKepemilikanRumahContent = await import("./content")
  return SuratKeteranganKepemilikanRumahContent
})

export const metadata = {
  title: "Surat Keterangan Kepemilikan Rumah",
}

export default function SuratKeteranganKepemilikanRumahPage() {
  prefetch(
    trpc.suratKeteranganKepemilikanRumah.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganKepemilikanRumah.count.queryOptions())

  return <SuratKeteranganKepemilikanRumahContent />
}
