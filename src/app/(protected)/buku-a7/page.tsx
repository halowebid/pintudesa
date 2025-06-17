import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const AgendaContent = dynamicFn(async () => {
  const AgendaContent = await import("./content")
  return AgendaContent
})

export const metadata = {
  title: "Agenda",
}

export default function AgendaPage() {
  prefetch(
    trpc.agenda.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.agenda.count.queryOptions())

  return <AgendaContent />
}
