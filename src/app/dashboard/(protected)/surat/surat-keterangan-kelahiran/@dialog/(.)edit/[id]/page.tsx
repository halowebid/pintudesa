import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganKelahiranForm = dynamicFn(async () => {
  const SuratKeteranganKelahiranForm = await import("../../../edit/[id]/form")
  return SuratKeteranganKelahiranForm
})

export const metadata = {
  title: "Edit Surat Keterangan Kelahiran",
}

export default function SuratKeteranganKelahiranPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratKeteranganKelahiranForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
