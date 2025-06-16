import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const AgendaForm = dynamicFn(async () => {
  const AgendaForm = await import("../../tambah/form")
  return AgendaForm
})
export const metadata = {
  title: "Buat Agenda",
}

export default function AgendaPage() {
  return (
    <DialogWrapper>
      <AgendaForm />
    </DialogWrapper>
  )
}
