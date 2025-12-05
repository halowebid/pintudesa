import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const PendudukForm = dynamicFn(async () => {
  const PendudukForm = await import("../../../pisah/[id]/form")
  return PendudukForm
})
export const metadata = {
  title: "Pisah Kartu Keluarga",
}

export default async function PendudukPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <PendudukForm originalKkId={id} isDialog />
    </DialogWrapper>
  )
}
