import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganKematianContent = dynamicFn(async () => {
  const SuratKeteranganKematianContent = await import("./content")
  return SuratKeteranganKematianContent
})

export const metadata: Metadata = {
  title: "Surat Keterangan Kematian",
}

export default function SuratKeteranganKematianPage() {
  prefetch(
    trpc.suratKeteranganKematian.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganKematian.count.queryOptions())

  return <SuratKeteranganKematianContent />
}
