import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const KegiatanPembangunanForm = dynamicFn(async () => {
  const KegiatanPembangunanForm = await import("../../tambah/form")
  return KegiatanPembangunanForm
})
export const metadata = {
  title: "Buat Kegiatan Pembangunan",
}

export default function KegiatanPembangunanPage() {
  return (
    <DialogWrapper>
      <KegiatanPembangunanForm isDialog />
    </DialogWrapper>
  )
}
