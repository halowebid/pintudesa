import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const KegiatanPembangunanForm = dynamicFn(async () => {
  const KegiatanPembangunanForm = await import("../../../edit/[id]/form")
  return KegiatanPembangunanForm
})
export const metadata = {
  title: "Edit Kegiatan Pembangunan",
}

export default async function KegiatanPembangunanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <KegiatanPembangunanForm id={id} isDialog />
    </DialogWrapper>
  )
}
