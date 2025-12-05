import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganKematianForm = dynamicFn(async () => {
  const SuratKeteranganKematianForm = await import("../../tambah/form")
  return SuratKeteranganKematianForm
})
export const metadata: Metadata = {
  title: "Buat Surat Keterangan Kematian",
}

export default function SuratKeteranganKematianPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganKematianForm isDialog />
    </DialogWrapper>
  )
}
