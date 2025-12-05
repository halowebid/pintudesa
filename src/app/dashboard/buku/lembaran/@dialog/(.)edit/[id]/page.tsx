import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const LembaranForm = dynamicFn(async () => {
  const LembaranForm = await import("../../../edit/[id]/form")
  return LembaranForm
})
export const metadata = {
  title: "Edit Lembaran",
}

export default async function LembaranPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <LembaranForm id={id} isDialog />
    </DialogWrapper>
  )
}
