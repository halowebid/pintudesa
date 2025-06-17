import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const AgendaForm = dynamicFn(async () => {
  const AgendaForm = await import("../../../edit/[id]/form")
  return AgendaForm
})
export const metadata = {
  title: "Edit Agenda",
}

export default async function AgendaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <AgendaForm id={id} isDialog />
    </DialogWrapper>
  )
}
