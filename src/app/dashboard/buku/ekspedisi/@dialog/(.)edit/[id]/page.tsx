import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const EkspedisiForm = dynamicFn(async () => {
  const EkspedisiForm = await import("../../../edit/[id]/form")
  return EkspedisiForm
})
export const metadata = {
  title: "Edit Ekspedisi",
}

export default async function EkspedisiPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <EkspedisiForm id={id} isDialog />
    </DialogWrapper>
  )
}
