import * as React from "react"

import SuratKeteranganBedaNamaEditForm from "./form"

export const metadata = {
  title: "Edit Surat Keterangan Beda Nama",
}

export default async function EditSuratKeteranganBedaNamaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <SuratKeteranganBedaNamaEditForm id={id} isDialog={false} />
}
