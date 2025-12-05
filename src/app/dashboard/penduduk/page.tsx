import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const PendudukContent = dynamicFn(async () => {
  const PendudukContent = await import("./content")
  return PendudukContent
})

export const metadata = {
  title: "Buku Penduduk",
}

export default function PendudukPage() {
  prefetch(
    trpc.penduduk.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.penduduk.count.queryOptions())

  return <PendudukContent />
}
