import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const SuratKeteranganPenghasilanOrangTuaForm = dynamicFn(async () => {
  const SuratKeteranganPenghasilanOrangTuaForm = await import(
    "../../../edit/[id]/form"
  )
  return SuratKeteranganPenghasilanOrangTuaForm
})

export const metadata = {
  title: "Edit Surat Keterangan Penghasilan Orang Tua",
}

export default function SuratKeteranganPenghasilanOrangTuaPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratKeteranganPenghasilanOrangTuaForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
