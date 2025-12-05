import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKeteranganBedaNamaForm = dynamicFn(async () => {
  return await import("../../tambah/form")
})

export const metadata = {
  title: "Buat Surat Keterangan Beda Nama",
}

export default function SuratKeteranganBedaNamaDialogPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganBedaNamaForm isDialog />
    </DialogWrapper>
  )
}
