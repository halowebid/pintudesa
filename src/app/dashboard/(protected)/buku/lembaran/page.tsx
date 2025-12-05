import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const LembaranContent = dynamicFn(async () => {
  const LembaranContent = await import("./content")
  return LembaranContent
})

export const metadata = {
  title: "Buku Lembaran dan Buku Berita Desa",
}

export default function LembaranPage() {
  prefetch(
    trpc.lembaran.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.lembaran.count.queryOptions())

  return <LembaranContent />
}
