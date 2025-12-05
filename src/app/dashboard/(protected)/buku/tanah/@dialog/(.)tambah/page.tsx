import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const TanahForm = dynamicFn(async () => {
  const TanahForm = await import("../../tambah/form")
  return TanahForm
})
export const metadata = {
  title: "Buat Tanah",
}

export default function TanahPage() {
  return (
    <DialogWrapper>
      <TanahForm isDialog />
    </DialogWrapper>
  )
}
