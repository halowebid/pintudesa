import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKuasaSKGRForm = dynamicFn(async () => {
  const SuratKuasaSKGRForm = await import("../../../edit/[id]/form")
  return SuratKuasaSKGRForm
})

export const metadata = {
  title: "Edit Surat Kuasa SKGR",
}

export default function SuratKuasaSKGRPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratKuasaSKGRForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
