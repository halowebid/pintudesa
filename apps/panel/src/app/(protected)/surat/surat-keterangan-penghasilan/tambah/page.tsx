import * as React from "react"

import SuratKeteranganPenghasilanForm from "./form"

export const metadata = {
  title: "Tambah Surat Keterangan Penghasilan",
}

export default function TambahSuratKeteranganPenghasilanPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">Tambah Surat Keterangan Penghasilan</h1>
      <SuratKeteranganPenghasilanForm isDialog={false} />
    </div>
  )
}
