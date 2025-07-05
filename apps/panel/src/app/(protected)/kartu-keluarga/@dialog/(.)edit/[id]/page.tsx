import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const PendudukForm = dynamicFn(async () => {
  const PendudukForm = await import("../../../edit/[id]/form")
  return PendudukForm
})
export const metadata = {
  title: "Edit Kartu Keluarga",
}

export default async function PendudukPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <PendudukForm id={id} isDialog />
    </DialogWrapper>
  )
}
