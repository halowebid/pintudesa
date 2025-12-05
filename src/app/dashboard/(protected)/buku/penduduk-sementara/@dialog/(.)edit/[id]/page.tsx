import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const PendudukSementaraForm = dynamicFn(async () => {
  const PendudukSementaraForm = await import("../../../edit/[id]/form")
  return PendudukSementaraForm
})
export const metadata = {
  title: "Edit Penduduk Sementara",
}

export default async function PendudukSementaraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <PendudukSementaraForm id={id} isDialog />
    </DialogWrapper>
  )
}
