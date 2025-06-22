import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const InventarisHasilPembangunanForm = dynamicFn(async () => {
  const InventarisHasilPembangunanForm = await import("../../../edit/[id]/form")
  return InventarisHasilPembangunanForm
})
export const metadata = {
  title: "Edit Inventaris Hasil Pembangunan",
}

export default async function InventarisHasilPembangunanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <InventarisHasilPembangunanForm id={id} isDialog />
    </DialogWrapper>
  )
}
