import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const KegiatanPembangunanContent = dynamicFn(async () => {
  const KegiatanPembangunanContent = await import("./content")
  return KegiatanPembangunanContent
})

export const metadata = {
  title: "Buku Kegiatan Pembangunan",
}

export default function KegiatanPembangunanPage() {
  prefetch(
    trpc.kegiatanPembangunan.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.kegiatanPembangunan.count.queryOptions())

  return <KegiatanPembangunanContent />
}
