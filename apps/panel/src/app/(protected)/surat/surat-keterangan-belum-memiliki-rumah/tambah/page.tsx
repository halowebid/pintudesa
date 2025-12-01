import * as React from "react"

import SuratKeteranganBelumMemilikiRumahForm from "./form"

export const metadata = {
  title: "Tambah Surat Keterangan Belum Memiliki Rumah",
}

export default function TambahSuratKeteranganBelumMemilikiRumahPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">
        Tambah Surat Keterangan Belum Memiliki Rumah
      </h1>
      <SuratKeteranganBelumMemilikiRumahForm isDialog={false} />
    </div>
  )
}
