import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const InventarisForm = dynamicFn(async () => {
  const InventarisForm = await import("../../../edit/[id]/form")
  return InventarisForm
})
export const metadata = {
  title: "Edit Inventaris",
}

export default async function InventarisPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <InventarisForm id={id} isDialog />
    </DialogWrapper>
  )
}
