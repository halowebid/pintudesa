import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratIzinKeramaianContent = dynamicFn(async () => {
  const SuratIzinKeramaianContent = await import("./content")
  return SuratIzinKeramaianContent
})

export const metadata = {
  title: "Surat Izin Keramaian",
}

export default function SuratIzinKeramaianPage() {
  prefetch(
    trpc.suratIzinKeramaian.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratIzinKeramaian.count.queryOptions())

  return <SuratIzinKeramaianContent />
}
