import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratPernyataanBelumMenikahForm = dynamicFn(async () => {
  const SuratPernyataanBelumMenikahForm = await import("../../tambah/form")
  return SuratPernyataanBelumMenikahForm
})
export const metadata = {
  title: "Buat Surat Pernyataan Belum Menikah",
}

export default function SuratPernyataanBelumMenikahPage() {
  return (
    <DialogWrapper>
      <SuratPernyataanBelumMenikahForm isDialog />
    </DialogWrapper>
  )
}
