import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganAhliWarisForm = dynamicFn(async () => {
  const SuratKeteranganAhliWarisForm = await import("../../edit/form")
  return SuratKeteranganAhliWarisForm
})

export const metadata = {
  title: "Edit Surat Keterangan Ahli Waris",
}

export default function SuratKeteranganAhliWarisEditDialogPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganAhliWarisForm isDialog />
    </DialogWrapper>
  )
}
