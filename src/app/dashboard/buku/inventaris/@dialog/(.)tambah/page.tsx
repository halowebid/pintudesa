import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const InventarisForm = dynamicFn(async () => {
  const InventarisForm = await import("../../tambah/form")
  return InventarisForm
})
export const metadata = {
  title: "Buat Inventaris",
}

export default function InventarisPage() {
  return (
    <DialogWrapper>
      <InventarisForm isDialog />
    </DialogWrapper>
  )
}
