import type { Metadata } from "next"

import SuratKeteranganBedaNamaContent from "./content"

export const metadata: Metadata = {
  title: "Surat Keterangan Beda Nama",
}

export default function Page() {
  return <SuratKeteranganBedaNamaContent />
}
