import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganJalanForm = dynamicFn(async () => {
  const SuratKeteranganJalanForm = await import("../../../edit/[id]/form")
  return SuratKeteranganJalanForm
})

export const metadata = {
  title: "Edit Surat Keterangan Jalan",
}

export default function SuratKeteranganJalanPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratKeteranganJalanForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
