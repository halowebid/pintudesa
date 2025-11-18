import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganPenghasilanContent = dynamicFn(async () => {
  const SuratKeteranganPenghasilanContent = await import("./content")
  return SuratKeteranganPenghasilanContent
})

export const metadata = {
  title: "Surat Keterangan Penghasilan",
}

export default function SuratKeteranganPenghasilanPage() {
  prefetch(
    trpc.suratKeteranganPenghasilan.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganPenghasilan.count.queryOptions())

  return <SuratKeteranganPenghasilanContent />
}
