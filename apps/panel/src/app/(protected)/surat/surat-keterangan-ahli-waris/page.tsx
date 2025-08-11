import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganAhliWarisContent = dynamicFn(async () => {
  const SuratKeteranganAhliWarisContent = await import("./content")
  return SuratKeteranganAhliWarisContent
})

export const metadata: Metadata = {
  title: "Surat Keterangan Ahli Waris",
}

export default function SuratKeteranganAhliWarisPage() {
  prefetch(
    trpc.suratKuasaAhliWaris.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKuasaAhliWaris.count.queryOptions())

  return <SuratKeteranganAhliWarisContent />
}
