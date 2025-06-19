import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const TanahKasContent = dynamicFn(async () => {
  const TanahKasContent = await import("./content")
  return TanahKasContent
})

export const metadata = {
  title: "Buku TanahKas",
}

export default function TanahKasPage() {
  prefetch(
    trpc.tanahKas.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.tanahKas.count.queryOptions())

  return <TanahKasContent />
}
