import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const TanahKasForm = dynamicFn(async () => {
  const TanahKasForm = await import("../../../edit/[id]/form")
  return TanahKasForm
})
export const metadata = {
  title: "Edit Tanah Kas",
}

export default async function TanahKasPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <TanahKasForm id={id} isDialog />
    </DialogWrapper>
  )
}
