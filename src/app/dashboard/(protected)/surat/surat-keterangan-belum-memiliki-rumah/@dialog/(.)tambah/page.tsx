import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganBelumMemilikiRumahForm = dynamicFn(async () => {
  return await import("../../tambah/form")
})

export const metadata = {
  title: "Tambah Surat Keterangan Belum Memiliki Rumah",
}

export default function TambahSuratKeteranganBelumMemilikiRumahDialogPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganBelumMemilikiRumahForm isDialog />
    </DialogWrapper>
  )
}
