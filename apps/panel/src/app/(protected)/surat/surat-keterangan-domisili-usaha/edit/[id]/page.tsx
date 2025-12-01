import * as React from "react"

import SuratKeteranganDomisiliUsahaEditForm from "./form"

export const metadata = {
  title: "Edit Surat Keterangan Domisili Usaha",
}

export default async function EditSuratKeteranganDomisiliUsahaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <SuratKeteranganDomisiliUsahaEditForm id={id} isDialog={false} />
}
