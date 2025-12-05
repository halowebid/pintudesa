import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganPenghasilanOrangTuaForm = dynamicFn(async () => {
  const SuratKeteranganPenghasilanOrangTuaForm = await import(
    "../../tambah/form"
  )
  return SuratKeteranganPenghasilanOrangTuaForm
})
export const metadata = {
  title: "Buat Surat Keterangan Penghasilan Orang Tua",
}

export default function SuratKeteranganPenghasilanOrangTuaPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganPenghasilanOrangTuaForm isDialog />
    </DialogWrapper>
  )
}
