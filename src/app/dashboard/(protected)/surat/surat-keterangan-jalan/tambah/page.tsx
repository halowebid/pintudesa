import * as React from "react"

import SuratKeteranganJalanForm from "./form"

export const metadata = {
  title: "Tambah Surat Keterangan Jalan",
}

export default function TambahSuratKeteranganJalanPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">Tambah Surat Keterangan Jalan</h1>
      <SuratKeteranganJalanForm isDialog={false} />
    </div>
  )
}
