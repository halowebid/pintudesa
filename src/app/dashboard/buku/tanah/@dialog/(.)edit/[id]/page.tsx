import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const TanahForm = dynamicFn(async () => {
  const TanahForm = await import("../../../edit/[id]/form")
  return TanahForm
})
export const metadata = {
  title: "Edit Tanah",
}

export default async function TanahPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <TanahForm id={id} isDialog />
    </DialogWrapper>
  )
}
