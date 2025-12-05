import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganAhliWarisForm = dynamicFn(async () => {
  const SuratKeteranganAhliWarisForm = await import("../../tambah/form")
  return SuratKeteranganAhliWarisForm
})

export const metadata = {
  title: "Buat Surat Keterangan Ahli Waris",
}

export default function SuratKeteranganAhliWarisDialogPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganAhliWarisForm isDialog />
    </DialogWrapper>
  )
}
