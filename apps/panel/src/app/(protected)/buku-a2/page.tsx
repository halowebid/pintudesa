import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const KeputusanKepalaDesaContent = dynamicFn(async () => {
  const KeputusanKepalaDesaContent = await import("./content")
  return KeputusanKepalaDesaContent
})

export const metadata = {
  title: "Buku Keputusan Kepala Desa",
}

export default function KeputusanKepalaDesaPage() {
  prefetch(
    trpc.keputusanKepalaDesa.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.keputusanKepalaDesa.count.queryOptions())

  return <KeputusanKepalaDesaContent />
}
