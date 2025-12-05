import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKeteranganDomisiliUsahaForm = dynamicFn(async () => {
  return await import("../../tambah/form")
})

export const metadata = {
  title: "Tambah Surat Keterangan Domisili Usaha",
}

export default function TambahSuratKeteranganDomisiliUsahaDialogPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganDomisiliUsahaForm isDialog />
    </DialogWrapper>
  )
}
