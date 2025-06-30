import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const SuratIzinKeramaianForm = dynamicFn(async () => {
  const SuratIzinKeramaianForm = await import("../../../edit/[id]/form")
  return SuratIzinKeramaianForm
})
export const metadata = {
  title: "Edit Surat Izin Keramaian",
}

export default async function SuratIzinKeramaianPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <SuratIzinKeramaianForm id={id} isDialog />
    </DialogWrapper>
  )
}
