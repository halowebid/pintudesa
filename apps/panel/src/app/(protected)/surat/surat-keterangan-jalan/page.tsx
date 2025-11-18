import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganJalanContent = dynamicFn(async () => {
  const SuratKeteranganJalanContent = await import("./content")
  return SuratKeteranganJalanContent
})

export const metadata = {
  title: "Surat Keterangan Jalan",
}

export default function SuratKeteranganJalanPage() {
  prefetch(
    trpc.suratKeteranganJalan.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganJalan.count.queryOptions())

  return <SuratKeteranganJalanContent />
}
