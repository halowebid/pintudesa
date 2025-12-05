import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratPernyataanBelumMenikahForm = dynamicFn(async () => {
  const SuratPernyataanBelumMenikahForm = await import(
    "../../../edit/[id]/form"
  )
  return SuratPernyataanBelumMenikahForm
})

export const metadata = {
  title: "Edit Surat Pernyataan Belum Menikah",
}

export default function SuratPernyataanBelumMenikahPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratPernyataanBelumMenikahForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
