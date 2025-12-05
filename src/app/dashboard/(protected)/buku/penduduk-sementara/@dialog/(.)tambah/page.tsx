import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const PendudukSementaraForm = dynamicFn(async () => {
  const PendudukSementaraForm = await import("../../tambah/form")
  return PendudukSementaraForm
})
export const metadata = {
  title: "Buat Penduduk Sementara",
}

export default function PendudukSementaraPage() {
  return (
    <DialogWrapper>
      <PendudukSementaraForm isDialog />
    </DialogWrapper>
  )
}
