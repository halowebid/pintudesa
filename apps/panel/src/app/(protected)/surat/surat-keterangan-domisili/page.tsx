import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganDomisiliContent = dynamicFn(async () => {
  const SuratKeteranganDomisiliContent = await import("./content")
  return SuratKeteranganDomisiliContent
})

export const metadata: Metadata = {
  title: "Surat Keterangan Domisili",
}

export default function SuratKeteranganDomisiliPage() {
  prefetch(
    trpc.suratKeteranganDomisili.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganDomisili.count.queryOptions())

  return <SuratKeteranganDomisiliContent />
}
