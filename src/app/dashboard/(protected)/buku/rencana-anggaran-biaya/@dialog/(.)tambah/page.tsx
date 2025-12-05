import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const RABForm = dynamicFn(async () => {
  const RABForm = await import("../../tambah/form")
  return RABForm
})
export const metadata = {
  title: "Buat Rencana Anggaran Biaya",
}

export default function RABPage() {
  return (
    <DialogWrapper>
      <RABForm isDialog />
    </DialogWrapper>
  )
}
