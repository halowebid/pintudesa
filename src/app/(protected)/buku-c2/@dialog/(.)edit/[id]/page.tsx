import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const RABForm = dynamicFn(async () => {
  const RABForm = await import("../../../edit/[id]/form")
  return RABForm
})
export const metadata = {
  title: "Edit Rencana Anggaran Biaya",
}

export default async function RABPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <RABForm id={id} isDialog />
    </DialogWrapper>
  )
}
