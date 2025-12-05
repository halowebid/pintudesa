import * as React from "react"

import SuratKeteranganPenghasilanOrangTuaForm from "./form"

export const metadata = {
  title: "Tambah Surat Keterangan Penghasilan Orang Tua",
}

export default function TambahSuratKeteranganPenghasilanOrangTuaPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">
        Tambah Surat Keterangan Penghasilan Orang Tua
      </h1>
      <SuratKeteranganPenghasilanOrangTuaForm isDialog={false} />
    </div>
  )
}
