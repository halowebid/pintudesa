import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganGaibContent = dynamicFn(async () => {
  const SuratKeteranganGaibContent = await import("./content")
  return SuratKeteranganGaibContent
})

export const metadata = {
  title: "Surat Keterangan Gaib",
}

export default function SuratKeteranganGaibPage() {
  prefetch(
    trpc.suratKeteranganGaib.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganGaib.count.queryOptions())

  return <SuratKeteranganGaibContent />
}
