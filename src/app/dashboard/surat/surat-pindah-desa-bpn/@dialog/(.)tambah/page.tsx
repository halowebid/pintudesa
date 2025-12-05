import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const FeatureForm = dynamicFn(async () => {
  return await import("../../tambah/form")
})

export const metadata = {
  title: "Buat Surat Pindah Desa BPN",
}

export default function SuratPindahDesaBpnTambahDialog() {
  return (
    <DialogWrapper>
      <FeatureForm isDialog />
    </DialogWrapper>
  )
}
