import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKeteranganKelahiranForm = dynamicFn(async () => {
  const SuratKeteranganKelahiranForm = await import("../../tambah/form")
  return SuratKeteranganKelahiranForm
})
export const metadata = {
  title: "Buat Surat Keterangan Kelahiran",
}

export default function SuratKeteranganKelahiranPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganKelahiranForm isDialog />
    </DialogWrapper>
  )
}
