import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const SuratKeteranganKematianForm = dynamicFn(async () => {
  const SuratKeteranganKematianForm = await import("../../../edit/[id]/form")
  return SuratKeteranganKematianForm
})
export const metadata: Metadata = {
  title: "Edit Surat Keterangan Kematian",
}

export default async function SuratKeteranganKematianPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <SuratKeteranganKematianForm id={id} isDialog />
    </DialogWrapper>
  )
}
