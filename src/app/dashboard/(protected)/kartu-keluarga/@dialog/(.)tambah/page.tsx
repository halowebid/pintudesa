import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const PendudukForm = dynamicFn(async () => {
  const PendudukForm = await import("../../tambah/form")
  return PendudukForm
})
export const metadata = {
  title: "Buat Penduduk",
}

export default function PendudukPage() {
  return (
    <DialogWrapper>
      <PendudukForm isDialog />
    </DialogWrapper>
  )
}
