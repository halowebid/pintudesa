import type { Metadata } from "next"

import SuratKuasaSKGRForm from "./form"

const metadata: Metadata = {
  title: "Edit Surat Kuasa SKGR",
}

export { metadata }

export default function SuratKuasaSKGREditPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="container max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Surat Kuasa SKGR</h1>
      </div>
      <SuratKuasaSKGRForm id={params.id} isDialog={false} />
    </div>
  )
}
