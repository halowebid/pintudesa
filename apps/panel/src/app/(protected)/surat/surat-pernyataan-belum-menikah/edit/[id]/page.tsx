import type { Metadata } from "next"

import SuratPernyataanBelumMenikahForm from "./form"

const metadata: Metadata = {
  title: "Edit Surat Pernyataan Belum Menikah",
}

export { metadata }

export default function SuratPernyataanBelumMenikahEditPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="container max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Edit Surat Pernyataan Belum Menikah
        </h1>
      </div>
      <SuratPernyataanBelumMenikahForm id={params.id} isDialog={false} />
    </div>
  )
}
