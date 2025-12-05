import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const EkspedisiForm = dynamicFn(async () => {
  const EkspedisiForm = await import("../../tambah/form")
  return EkspedisiForm
})
export const metadata = {
  title: "Buat Ekspedisi",
}

export default function EkspedisiPage() {
  return (
    <DialogWrapper>
      <EkspedisiForm isDialog />
    </DialogWrapper>
  )
}
