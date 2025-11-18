import * as React from "react"

import SuratKeteranganKepemilikanRumahForm from "./form"

export const metadata = {
  title: "Tambah Surat Keterangan Kepemilikan Rumah",
}

export default function TambahSuratKeteranganKepemilikanRumahPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">
        Tambah Surat Keterangan Kepemilikan Rumah
      </h1>
      <SuratKeteranganKepemilikanRumahForm isDialog={false} />
    </div>
  )
}
