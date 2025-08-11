import type { Metadata } from "next"

import SuratPengantarSKCKForm from "./form"

const metadata: Metadata = {
  title: "Edit Surat Pengantar SKCK",
}

export { metadata }

export default function SuratPengantarSKCKEditPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="container max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Surat Pengantar SKCK</h1>
      </div>
      <SuratPengantarSKCKForm id={params.id} isDialog={false} />
    </div>
  )
}
