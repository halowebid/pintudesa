import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const PendudukSementaraContent = dynamicFn(async () => {
  const PendudukSementaraContent = await import("./content")
  return PendudukSementaraContent
})

export const metadata = {
  title: "Penduduk Sementara",
}

export default function PendudukSementaraPage() {
  prefetch(
    trpc.pendudukSementara.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.pendudukSementara.count.queryOptions())

  return <PendudukSementaraContent />
}
