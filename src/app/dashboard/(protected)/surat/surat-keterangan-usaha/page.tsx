import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganUsahaContent = dynamicFn(async () => {
  const SuratKeteranganUsahaContent = await import("./content")
  return SuratKeteranganUsahaContent
})

export const metadata = {
  title: "Surat Keterangan Usaha",
}

export default function SuratKeteranganUsahaPage() {
  prefetch(
    trpc.suratKeteranganUsaha.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganUsaha.count.queryOptions())

  return <SuratKeteranganUsahaContent />
}
