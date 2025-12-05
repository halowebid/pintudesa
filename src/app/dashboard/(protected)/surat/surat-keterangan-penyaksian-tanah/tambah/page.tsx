import * as React from "react"

import SuratKeteranganPenyaksianTanahForm from "./form"

export const metadata = {
  title: "Tambah Surat Keterangan Penyaksian Tanah",
}

export default function TambahSuratKeteranganPenyaksianTanahPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">
        Tambah Surat Keterangan Penyaksian Tanah
      </h1>
      <SuratKeteranganPenyaksianTanahForm isDialog={false} />
    </div>
  )
}
