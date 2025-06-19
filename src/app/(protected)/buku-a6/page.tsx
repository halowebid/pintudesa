import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const TanahContent = dynamicFn(async () => {
  const TanahContent = await import("./content")
  return TanahContent
})

export const metadata = {
  title: "Buku Tanah",
}

export default function TanahPage() {
  prefetch(
    trpc.tanah.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.tanah.count.queryOptions())

  return <TanahContent />
}
