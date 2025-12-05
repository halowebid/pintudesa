import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKuasaSKGRForm = dynamicFn(async () => {
  const SuratKuasaSKGRForm = await import("../../tambah/form")
  return SuratKuasaSKGRForm
})
export const metadata = {
  title: "Buat Surat Kuasa SKGR",
}

export default function SuratKuasaSKGRPage() {
  return (
    <DialogWrapper>
      <SuratKuasaSKGRForm isDialog />
    </DialogWrapper>
  )
}
