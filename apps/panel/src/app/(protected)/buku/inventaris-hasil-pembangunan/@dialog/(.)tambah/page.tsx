import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const InventarisHasilPembangunanForm = dynamicFn(async () => {
  const InventarisHasilPembangunanForm = await import("../../tambah/form")
  return InventarisHasilPembangunanForm
})
export const metadata = {
  title: "Buat Inventaris Hasil Pembangunan",
}

export default function InventarisHasilPembangunanPage() {
  return (
    <DialogWrapper>
      <InventarisHasilPembangunanForm isDialog />
    </DialogWrapper>
  )
}
