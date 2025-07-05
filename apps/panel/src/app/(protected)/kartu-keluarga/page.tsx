import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const KartuKeluargaContent = dynamicFn(async () => {
  const KartuKeluargaContent = await import("./content")
  return KartuKeluargaContent
})

export const metadata = {
  title: "Kartu Keluarga",
}

export default function PendudukPage() {
  prefetch(
    trpc.penduduk.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.penduduk.count.queryOptions())

  return <KartuKeluargaContent />
}
