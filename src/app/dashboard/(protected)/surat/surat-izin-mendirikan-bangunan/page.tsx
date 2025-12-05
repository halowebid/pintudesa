import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratIzinMendirikanBangunanContent = dynamicFn(async () => {
  const SuratIzinMendirikanBangunanContent = await import("./content")
  return SuratIzinMendirikanBangunanContent
})

export const metadata = {
  title: "Surat Izin Mendirikan Bangunan",
}

export default function SuratIzinMendirikanBangunanPage() {
  prefetch(
    trpc.suratIzinMendirikanBangunan.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratIzinMendirikanBangunan.count.queryOptions())

  return <SuratIzinMendirikanBangunanContent />
}
