import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const TemplateSuratContent = dynamicFn(async () => {
  const TemplateSuratContent = await import("./content")
  return TemplateSuratContent
})

export const metadata = {
  title: "Template Surat",
}

export default function TemplateSuratPage() {
  prefetch(
    trpc.suratTemplate.all.queryOptions({
      page: 1,
      perPage: 100,
    }),
  )

  prefetch(trpc.suratTemplate.count.queryOptions())

  return <TemplateSuratContent />
}
