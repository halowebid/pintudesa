import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const SuratKeteranganPenghasilanOrangTuaForm = dynamicFn(async () => {
  const SuratKeteranganPenghasilanOrangTuaForm = await import("./form")
  return SuratKeteranganPenghasilanOrangTuaForm
})

export const metadata = {
  title: "Edit Surat Keterangan Penghasilan Orang Tua",
}

export default async function EditSuratKeteranganPenghasilanOrangTuaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganPenghasilanOrangTuaForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
