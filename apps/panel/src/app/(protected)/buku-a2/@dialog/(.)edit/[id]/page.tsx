import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const KeputusanKepalaDesaForm = dynamicFn(async () => {
  const KeputusanKepalaDesaForm = await import("../../../edit/[id]/form")
  return KeputusanKepalaDesaForm
})
export const metadata = {
  title: "Edit Keputusan Kepala Desa",
}

export default async function KeputusanKepalaDesaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <KeputusanKepalaDesaForm id={id} isDialog />
    </DialogWrapper>
  )
}
