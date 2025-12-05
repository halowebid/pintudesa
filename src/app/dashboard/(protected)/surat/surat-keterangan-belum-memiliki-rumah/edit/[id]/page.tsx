import * as React from "react"

import SuratKeteranganBelumMemilikiRumahEditForm from "./form"

export const metadata = {
  title: "Edit Surat Keterangan Belum Memiliki Rumah",
}

export default async function EditSuratKeteranganBelumMemilikiRumahPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <SuratKeteranganBelumMemilikiRumahEditForm id={id} isDialog={false} />
}
