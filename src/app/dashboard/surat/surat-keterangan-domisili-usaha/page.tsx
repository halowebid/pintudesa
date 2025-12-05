import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganDomisiliUsahaContent = dynamicFn(async () => {
  const SuratKeteranganDomisiliUsahaContent = await import("./content")
  return SuratKeteranganDomisiliUsahaContent
})

export const metadata = {
  title: "Surat Keterangan Domisili Usaha",
}

export default function SuratKeteranganDomisiliUsahaPage() {
  prefetch(
    trpc.suratKeteranganDomisiliUsaha.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganDomisiliUsaha.count.queryOptions())

  return <SuratKeteranganDomisiliUsahaContent />
}
