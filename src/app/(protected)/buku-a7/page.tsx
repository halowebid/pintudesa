import * as React from "react"
import dynamicFn from "next/dynamic"

const AgendaContent = dynamicFn(async () => {
  const AgendaContent = await import("./content")
  return AgendaContent
})

export const metadata = {
  title: "Agenda",
}

export default function AgendaPage() {
  return <AgendaContent />
}
