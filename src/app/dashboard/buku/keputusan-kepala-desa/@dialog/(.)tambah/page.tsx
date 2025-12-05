import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const KeputusanKepalaDesaForm = dynamicFn(async () => {
  const KeputusanKepalaDesaForm = await import("../../tambah/form")
  return KeputusanKepalaDesaForm
})
export const metadata = {
  title: "Buat Keputusan Kepala Desa",
}

export default function KeputusanKepalaDesaPage() {
  return (
    <DialogWrapper>
      <KeputusanKepalaDesaForm isDialog />
    </DialogWrapper>
  )
}
