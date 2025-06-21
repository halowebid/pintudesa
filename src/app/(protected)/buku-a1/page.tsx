import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const PeraturanContent = dynamicFn(async () => {
  const PeraturanContent = await import("./content")
  return PeraturanContent
})

export const metadata = {
  title: "Buku Peraturan",
}

export default function PeraturanPage() {
  prefetch(
    trpc.peraturan.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.peraturan.count.queryOptions())

  return <PeraturanContent />
}
