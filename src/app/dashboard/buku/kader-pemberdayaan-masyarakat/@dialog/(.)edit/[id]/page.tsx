import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const KaderPemberdayaanMasyarakatForm = dynamicFn(async () => {
  const KaderPemberdayaanMasyarakatForm = await import(
    "../../../edit/[id]/form"
  )
  return KaderPemberdayaanMasyarakatForm
})
export const metadata = {
  title: "Edit Kader Pemberdayaan Masyarakat",
}

export default async function KaderPemberdayaanMasyarakatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <KaderPemberdayaanMasyarakatForm id={id} isDialog />
    </DialogWrapper>
  )
}
