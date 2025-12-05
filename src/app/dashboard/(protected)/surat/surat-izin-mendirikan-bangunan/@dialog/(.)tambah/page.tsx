import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratIzinMendirikanBangunanForm = dynamicFn(async () => {
  const SuratIzinMendirikanBangunanForm = await import("../../tambah/form")
  return SuratIzinMendirikanBangunanForm
})
export const metadata = {
  title: "Buat Surat Izin Mendirikan Bangunan",
}

export default function SuratIzinMendirikanBangunanPage() {
  return (
    <DialogWrapper>
      <SuratIzinMendirikanBangunanForm isDialog />
    </DialogWrapper>
  )
}
