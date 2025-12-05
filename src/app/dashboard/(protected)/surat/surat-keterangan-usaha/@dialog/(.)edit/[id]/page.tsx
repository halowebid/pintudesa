import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganUsahaEditForm = dynamicFn(async () => {
  const SuratKeteranganUsahaEditForm = await import("../../../edit/[id]/form")
  return SuratKeteranganUsahaEditForm
})
export const metadata = {
  title: "Edit Surat Keterangan Usaha",
}

export default async function SuratKeteranganUsahaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <SuratKeteranganUsahaEditForm id={id} isDialog />
    </DialogWrapper>
  )
}
