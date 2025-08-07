import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const KaderPemberdayaanMasyarakatForm = dynamicFn(async () => {
  const KaderPemberdayaanMasyarakatForm = await import("../../tambah/form")
  return KaderPemberdayaanMasyarakatForm
})
export const metadata = {
  title: "Buat Kader Pemberdayaan Masyarakat",
}

export default function KaderPemberdayaanMasyarakatPage() {
  return (
    <DialogWrapper>
      <KaderPemberdayaanMasyarakatForm isDialog />
    </DialogWrapper>
  )
}
