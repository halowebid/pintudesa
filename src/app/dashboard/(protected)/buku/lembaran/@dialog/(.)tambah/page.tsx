import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const LembaranForm = dynamicFn(async () => {
  const LembaranForm = await import("../../tambah/form")
  return LembaranForm
})
export const metadata = {
  title: "Buat Lembaran",
}

export default function LembaranPage() {
  return (
    <DialogWrapper>
      <LembaranForm isDialog />
    </DialogWrapper>
  )
}
