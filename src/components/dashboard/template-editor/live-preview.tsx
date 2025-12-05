"use client"

import { useMemo } from "react"
import type { SuratType } from "@/lib/db/schema"

interface LivePreviewProps {
  content: string
  suratType: SuratType
  className?: string
}

function generateSampleData(suratType: SuratType): Record<string, string> {
  const commonData: Record<string, string> = {
    namaDesa: "Desa Contoh",
    kecamatan: "Kecamatan Contoh",
    kabupaten: "Kabupaten Contoh",
    provinsi: "Provinsi Contoh",
    tanggalSurat: "18 November 2025",
    tahunSurat: "2025",
    namaKepala: "Budi Santoso, S.Sos",
    nipKepala: "196505101985031004",
    "pemohon.nik": "3201012801890001",
    "pemohon.namaLengkap": "Ahmad Sulaiman",
    "pemohon.tempatLahir": "Bandung",
    "pemohon.tanggalLahir": "28 Januari 1989",
    "pemohon.jenisKelamin": "Laki-laki",
    "pemohon.agama": "Islam",
    "pemohon.statusPerkawinan": "Kawin",
    "pemohon.pekerjaan": "Wiraswasta",
    "pemohon.pendidikanTerakhir": "SMA/Sederajat",
    "pemohon.alamat": "Jl. Merdeka No. 123",
    "pemohon.rt": "001",
    "pemohon.rw": "002",
    "pemohon.dusun": "Dusun Makmur",
  }

  const typeSpecificData: Record<SuratType, Record<string, string>> = {
    "surat-keterangan-belum-memiliki-rumah": {
      tujuanPembuatan: "Pengajuan KPR",
      tempatTinggalSekarang: "rumah orang tua di Jl. Merdeka No. 45",
    },
    "surat-keterangan-domisili": {
      jumlahTahunDomisili: "10",
      jumlahKeluarga: "4",
    },
    "surat-keterangan-domisili-usaha": {
      jenisUsaha: "Toko Kelontong",
      namaTempatUsaha: "Toko Berkah Jaya",
      lokasiUsaha: "Jl. Merdeka No. 123, RT 001/RW 002, Desa Contoh",
    },
    "surat-keterangan-gaib": {
      "pasangan.namaLengkap": "Siti Aminah",
      "pasangan.nik": "3201015506920002",
      tanggalDitinggal: "15 Maret 2020",
    },
    "surat-keterangan-kelahiran": {
      "ayah.namaLengkap": "Ahmad Sulaiman",
      "ayah.nik": "3201012801890001",
      "ibu.namaLengkap": "Rina Marlina",
      "ibu.nik": "3201015506920002",
      "bayi.namaLengkap": "Muhammad Rizki",
      jenisKelahiran: "Tunggal",
      anakKe: "2",
      penolongKelahiran: "Bidan",
      beratBayi: "3200",
      panjangBayi: "48",
    },
    "surat-keterangan-kematian": {
      "yangMeninggal.namaLengkap": "Siti Fatimah",
      "yangMeninggal.nik": "3201014512450001",
      tanggalMeninggal: "10 November 2025",
      jamMeninggal: "14:30",
      tempatMeninggal: "RSUD Contoh",
      penyebabKematian: "Sakit",
    },
    "surat-izin-keramaian": {},
    "surat-izin-mendirikan-bangunan": {},
    "surat-keterangan-jalan": {},
    "surat-keterangan-kepemilikan-rumah": {},
    "surat-keterangan-penghasilan": {},
    "surat-keterangan-penghasilan-orang-tua": {},
    "surat-keterangan-penyaksian-tanah": {},
    "surat-keterangan-usaha": {
      bidangUsaha: "Perdagangan",
      merkUsaha: "Toko Berkah Jaya",
      alamatUsaha: "Jl. Merdeka No. 123, RT 001/RW 002, Desa Contoh",
      berdasarkan: "Surat Keterangan Domisili Usaha No. 123/SKDU/2024",
    },
    "surat-keterangan-beda-nama": {
      namaLain: "Ahmad Sudrajat",
      tujuanPembuatan: "Pengurusan dokumen administrasi KTP",
    },
    "surat-kuasa-ahli-waris": {},
    "surat-kuasa-skgr": {},
    "surat-pengantar-skck": {},
    "surat-pernyataan-belum-menikah": {},
    "surat-pindah-desa-bpn": {
      nomorShm: "12345/SHM/2025",
      tanggalShm: "15 Januari 2020",
      keteranganSurat: "Pindah ke Desa Baru untuk keperluan pekerjaan",
    },
  }

  return {
    ...commonData,
    ...typeSpecificData[suratType],
  }
}

function replaceVariables(html: string, data: Record<string, string>): string {
  let result = html

  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g")
    result = result.replace(regex, value)
  }

  result = result.replace(/{{([^}]+)}}/g, (_, varName) => {
    return `<span style="background-color: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-size: 0.875em;">[${varName.trim()}]</span>`
  })

  return result
}

export default function LivePreview({
  content,
  suratType,
  className = "",
}: LivePreviewProps) {
  const sampleData = useMemo(() => generateSampleData(suratType), [suratType])

  const previewHtml = useMemo(() => {
    return replaceVariables(content, sampleData)
  }, [content, sampleData])

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h3 className="text-sm font-medium">Preview Langsung</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            Menggunakan data contoh
          </p>
        </div>
      </div>

      {/* Preview Content */}
      <div className="bg-muted/30 flex-1 overflow-y-auto p-6">
        {/* A4 Paper simulation */}
        <div className="mx-auto max-w-[210mm] border bg-white shadow-sm">
          {/* Padding to simulate A4 margins */}
          <div className="p-[20mm]">
            {content ? (
              <div
                className="prose prose-sm prose-headings:font-serif prose-headings:font-bold prose-p:text-justify prose-p:leading-relaxed prose-table:border-collapse prose-table:w-full prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:bg-gray-50 prose-td:border prose-td:border-gray-300 prose-td:p-2 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="text-muted-foreground flex h-64 items-center justify-center">
                <div className="text-center">
                  <p className="text-sm">Preview akan muncul di sini</p>
                  <p className="mt-2 text-xs">
                    Mulai mengetik untuk melihat preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { generateSampleData, replaceVariables }
