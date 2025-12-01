import * as React from "react"

import SuratKeteranganUsahaEditForm from "./form"

export const metadata = {
  title: "Edit Surat Keterangan Usaha",
}

export default async function EditSuratKeteranganUsahaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <SuratKeteranganUsahaEditForm id={id} isDialog={false} />
}
