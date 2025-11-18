import * as React from "react"

import SuratKeteranganGaibForm from "./form"

export const metadata = {
  title: "Tambah Surat Keterangan Gaib",
}

export default function TambahSuratKeteranganGaibPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">Tambah Surat Keterangan Gaib</h1>
      <SuratKeteranganGaibForm isDialog={false} />
    </div>
  )
}
