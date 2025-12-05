import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const PeraturanForm = dynamicFn(async () => {
  const PeraturanForm = await import("../../tambah/form")
  return PeraturanForm
})
export const metadata = {
  title: "Buat Peraturan",
}

export default function PeraturanPage() {
  return (
    <DialogWrapper>
      <PeraturanForm isDialog />
    </DialogWrapper>
  )
}
