import * as React from "react"

import SuratKeteranganDomisiliUsahaForm from "./form"

export const metadata = {
  title: "Tambah Surat Keterangan Domisili Usaha",
}

export default function TambahSuratKeteranganDomisiliUsahaPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">
        Tambah Surat Keterangan Domisili Usaha
      </h1>
      <SuratKeteranganDomisiliUsahaForm isDialog={false} />
    </div>
  )
}
