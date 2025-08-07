import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratPengantarSKCKContent = dynamicFn(async () => {
  const SuratPengantarSKCKContent = await import("./content")
  return SuratPengantarSKCKContent
})

export const metadata = {
  title: "Surat Pengantar SKCK",
}

export default function SuratPengantarSKCKPage() {
  prefetch(
    trpc.suratPengantarSKCK.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratPengantarSKCK.count.queryOptions())

  return <SuratPengantarSKCKContent />
}
