import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const PeraturanForm = dynamicFn(async () => {
  const PeraturanForm = await import("../../../edit/[id]/form")
  return PeraturanForm
})
export const metadata = {
  title: "Edit Peraturan",
}

export default async function PeraturanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <PeraturanForm id={id} isDialog />
    </DialogWrapper>
  )
}
