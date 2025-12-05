import * as React from "react"

import SuratIzinMendirikanBangunanForm from "./form"

export const metadata = {
  title: "Tambah Surat Izin Mendirikan Bangunan",
}

export default function TambahSuratIzinMendirikanBangunanPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">
        Tambah Surat Izin Mendirikan Bangunan
      </h1>
      <SuratIzinMendirikanBangunanForm isDialog={false} />
    </div>
  )
}
