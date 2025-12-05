import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const EkspedisiContent = dynamicFn(async () => {
  const EkspedisiContent = await import("./content")
  return EkspedisiContent
})

export const metadata = {
  title: "Buku Ekspedisi",
}

export default function EkspedisiPage() {
  prefetch(
    trpc.ekspedisi.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.ekspedisi.count.queryOptions())

  return <EkspedisiContent />
}
