import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratIzinKeramaianForm = dynamicFn(async () => {
  const SuratIzinKeramaianForm = await import("../../tambah/form")
  return SuratIzinKeramaianForm
})
export const metadata = {
  title: "Buat Surat Izin Keramaian",
}

export default function SuratIzinKeramaianPage() {
  return (
    <DialogWrapper>
      <SuratIzinKeramaianForm isDialog />
    </DialogWrapper>
  )
}
