import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const RencanaKerjaPembangunanContent = dynamicFn(async () => {
  const RencanaKerjaPembangunanContent = await import("./content")
  return RencanaKerjaPembangunanContent
})

export const metadata = {
  title: "Buku Rencana Kerja Pembangunan",
}

export default function RencanaKerjaPembangunanPage() {
  prefetch(
    trpc.rencanaKerjaPembangunan.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.rencanaKerjaPembangunan.count.queryOptions())

  return <RencanaKerjaPembangunanContent />
}
