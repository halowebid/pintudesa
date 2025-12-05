import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const TanahKasForm = dynamicFn(async () => {
  const TanahKasForm = await import("../../tambah/form")
  return TanahKasForm
})
export const metadata = {
  title: "Buat Tanah Kas",
}

export default function TanahKasPage() {
  return (
    <DialogWrapper>
      <TanahKasForm isDialog />
    </DialogWrapper>
  )
}
