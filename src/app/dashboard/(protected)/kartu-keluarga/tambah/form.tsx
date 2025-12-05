"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createListCollection, type ListCollection } from "@ark-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Icon } from "@yopem-ui/react-icons"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { FormAnggotaKeluargaDialog } from "@/components/dashboard/form-dialog/form-anggota-keluarga-keluarga"
import { useToast } from "@/components/toast-provider"
import {
  AGAMA,
  ASAL_PENDUDUK,
  JENIS_KELAMIN,
  JENIS_PEKERJAAN,
  KATEGORI_PENDUDUK,
  PENDIDIKAN_TERAKHIR,
  SHDK,
  STATUS_DOMISILI,
  STATUS_PERKAWINAN,
} from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import {
  Button,
  ComboboxPopover,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  SelectValueText,
} from "@/lib/ui"
import { useHandleTRPCError } from "@/lib/utils/error"

const pendudukSchema = z.object({
  id: z.string().optional(),
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  nik: z.string().min(1, "NIK wajib diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
  tanggalLahir: z.coerce.date({
    required_error: "Tanggal lahir wajib diisi",
    invalid_type_error: "Format tanggal tidak valid",
  }),

  jenisKelamin: z.enum(JENIS_KELAMIN),
  agama: z.enum(AGAMA),
  pendidikanTerakhir: z.enum(PENDIDIKAN_TERAKHIR),
  pekerjaan: z.enum(JENIS_PEKERJAAN),
  statusPerkawinan: z.enum(STATUS_PERKAWINAN),
  statusDomisili: z.enum(STATUS_DOMISILI),
  asalPenduduk: z.enum(ASAL_PENDUDUK),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  rt: z.string().min(1, "RT wajib diisi"),
  rw: z.string().min(1, "RW wajib diisi"),
  provinsi: z.string().min(1, "Provinsi wajib diisi"),
  kabupaten_kota: z.string().min(1, "Kabupaten/Kota wajib diisi"),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
  desa_kelurahan: z.string().min(1, "Desa/Kelurahan wajib diisi"),
  dusun: z.string().optional(),
  namaAyahKandung: z.string().min(1, "Nama ayah kandung wajib diisi"),
  namaIbuKandung: z.string().min(1, "Nama ibu kandung wajib diisi"),
  bantuanSosial: z.boolean(),
  disabilitas: z.boolean(),
  shdk: z.enum(SHDK, {
    errorMap: () => ({ message: "SHDK wajib dipilih" }),
  }),
})

const kartuKeluargaSchema = z.object({
  kategoriPenduduk: z.enum(KATEGORI_PENDUDUK),
  nomorKartuKeluarga: z.string().min(1, "Nomor KK wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  rt: z.string().min(1, "RT wajib diisi"),
  rw: z.string().min(1, "RW wajib diisi"),
  provisi: z.string().min(1, "Provinsi wajib diisi"),
  kabupaten_kota: z.string().min(1, "Kabupaten/Kota wajib diisi"),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
  desa_kelurahan: z.string().min(1, "Desa/Kelurahan wajib diisi"),
  dusun: z.string().optional(),
})

const combinedSchema = z.object({
  kartuKeluarga: kartuKeluargaSchema,
  kepalaKeluarga: pendudukSchema,
})

interface SelectedPenduduk
  extends Omit<z.infer<typeof pendudukSchema>, "shdk"> {
  label: string
  value: string
}

interface SelectedKepalaKeluarga extends z.infer<typeof pendudukSchema> {
  label: string
  value: string
}
type PendudukKey = keyof z.infer<typeof pendudukSchema>

export default function PendudukForm({ isDialog }: { isDialog: boolean }) {
  const [anggotaList, setAnggotaList] = React.useState<
    z.infer<typeof pendudukSchema>[]
  >([])

  const [searchKey, setSearchKey] = React.useState("")
  const [selectedKepalaKeluarga, setSelectedKepalaKeluarga] =
    React.useState<SelectedKepalaKeluarga | null>(null)

  const [anggotaSearchKey, setAnggotaSearchKey] = React.useState("")
  const [selectedAnggota, setSelectedAnggota] =
    React.useState<SelectedPenduduk | null>(null)
  const [selectedShdk, setSelectedShdk] = React.useState<SHDK | "">("")

  const [showEditAnggotaModal, setShowEditAnggotaModal] = React.useState(false)
  const [editingAnggotaIndex, setEditingAnggotaIndex] = React.useState<
    number | null
  >(null)

  const { toast } = useToast()
  const handleError = useHandleTRPCError()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: searchResults = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKey, limit: 10 },
      { enabled: !!searchKey },
    ),
  )

  const { data: anggotaSearchResults = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: anggotaSearchKey, limit: 10 },
      { enabled: !!anggotaSearchKey },
    ),
  )

  const pendudukOptionsRaw = React.useMemo(() => {
    return searchResults.map((p) => ({
      ...p,
      label: `${p.nik} (${p.namaLengkap})`,
      value: p.id,
    }))
  }, [searchResults])

  const pendudukOptions = React.useMemo(
    () => pendudukOptionsRaw.map(({ label, value }) => ({ label, value })),
    [pendudukOptionsRaw],
  )

  const anggotaPendudukOptionsRaw = React.useMemo(() => {
    return anggotaSearchResults.map((p) => ({
      ...p,
      label: `${p.nik} (${p.namaLengkap})`,
      value: p.id,
    }))
  }, [anggotaSearchResults])

  const shdkOptions = SHDK.filter((s) => s !== "kepala_keluarga").map(
    (item) => ({
      label: item.replace(/_/g, " ").toUpperCase(),
      value: item,
    }),
  )

  const shdkCollection: ListCollection = createListCollection({
    items: shdkOptions,
  })

  const { data: settingDatas } = useQuery({
    ...trpc.setting.byKey.queryOptions("setting:address"),
    retry: false,
  })

  const settingsValue = React.useMemo(() => {
    if (
      settingDatas &&
      typeof settingDatas === "object" &&
      "value" in settingDatas &&
      typeof (settingDatas as { value?: unknown }).value === "string" &&
      (settingDatas as { value: string }).value
    ) {
      try {
        return JSON.parse((settingDatas as { value: string }).value)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Gagal mem-parsing JSON dari data pengaturan:", error)
        return null
      }
    }
    return null
  }, [settingDatas])

  const defaultValues = React.useMemo<z.infer<typeof combinedSchema>>(() => {
    return {
      kartuKeluarga: {
        kategoriPenduduk: "penduduk_dalam_desa" as const,
        nomorKartuKeluarga: "",
        alamat: "",
        rt: "",
        rw: "",
        provisi: settingsValue?.alamat ?? "Jawa Barat",
        kabupaten_kota: settingsValue?.kabupaten_kota ?? "Bandung",
        kecamatan: settingsValue?.kecamatan ?? "Ciwidey",
        desa_kelurahan: settingsValue?.desa_kelurahan ?? "Ciwidey",
        dusun: "",
      },

      kepalaKeluarga: {
        id: "",
        namaLengkap: "",
        nik: "",
        tempatLahir: "",
        tanggalLahir: new Date(),
        jenisKelamin: "laki-laki",
        agama: "islam",
        pendidikanTerakhir: "tidak_atau_belum_sekolah",
        pekerjaan: "lainnya",
        statusPerkawinan: "belum_kawin",
        statusDomisili: "ktp_beralamat_di_desa_berdomisili_di_desa",
        asalPenduduk: "penduduk_desa",
        alamat: "",
        rt: "1",
        rw: "1",
        provinsi: "",
        kabupaten_kota: "",
        kecamatan: "",
        desa_kelurahan: "",
        dusun: "",
        namaAyahKandung: "",
        namaIbuKandung: "",
        bantuanSosial: false,
        disabilitas: false,
        shdk: "kepala_keluarga",
      },
    }
  }, [settingsValue])

  const { mutateAsync: createKartuKeluarga } = useMutation(
    trpc.kartuKeluarga.create.mutationOptions({
      onError: (error) => handleError(error, "Gagal membuat kartu keluarga"),
    }),
  )

  const { mutateAsync: createAnggotaKeluarga } = useMutation(
    trpc.anggotaKeluarga.create.mutationOptions({
      onError: (error) => handleError(error, "Gagal membuat anggota keluarga"),
    }),
  )

  const kartuKeluargasKey = trpc.kartuKeluarga.all.queryKey()
  const invalidateKartuKeluargasKey = React.useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: kartuKeluargasKey })
  }, [queryClient, kartuKeluargasKey])

  const handleCreateKartuKeluarga = React.useCallback(
    async (value: z.infer<typeof combinedSchema>["kartuKeluarga"]) => {
      const alamatKKPendudukDalam = {
        provisi: settingsValue?.alamat ?? "Jawa Barat",
        kabupaten_kota: settingsValue?.kabupaten_kota ?? "Bandung",
        kecamatan: settingsValue?.kecamatan ?? "Ciwidey",
        desa_kelurahan: settingsValue?.desa_kelurahan ?? "Ciwidey",
      }

      const isPendudukDalamDesa =
        value.kategoriPenduduk === "penduduk_dalam_desa"

      const kartuKeluargaInput = {
        ...value,
        provisi: isPendudukDalamDesa
          ? alamatKKPendudukDalam.provisi
          : value.provisi,
        kabupaten_kota: isPendudukDalamDesa
          ? alamatKKPendudukDalam.kabupaten_kota
          : value.kabupaten_kota,
        kecamatan: isPendudukDalamDesa
          ? alamatKKPendudukDalam.kecamatan
          : value.kecamatan,
        desa_kelurahan: isPendudukDalamDesa
          ? alamatKKPendudukDalam.desa_kelurahan
          : value.desa_kelurahan,
      }

      const kartuKeluargaData = await createKartuKeluarga(kartuKeluargaInput)

      if (!kartuKeluargaData) {
        throw new Error("Gagal membuat data kartu keluarga.")
      }
      return kartuKeluargaData
    },
    [createKartuKeluarga, settingsValue],
  )

  const handleCreateKepalaKeluarga = React.useCallback(
    async (
      kartuKeluargaId: string,
      kepalaKeluargaData: z.infer<typeof combinedSchema>["kepalaKeluarga"],
    ) => {
      if (!selectedKepalaKeluarga?.id) {
        throw new Error("ID Kepala Keluarga tidak ditemukan.")
      }

      await createAnggotaKeluarga({
        ...kepalaKeluargaData,
        shdk: "kepala_keluarga",
        pendudukId: selectedKepalaKeluarga.id,
        kartuKeluargaId: kartuKeluargaId,
      })
    },
    [createAnggotaKeluarga, selectedKepalaKeluarga],
  )

  const handleCreateAnggotaList = React.useCallback(
    async (kartuKeluargaId: string) => {
      await Promise.all(
        anggotaList.map(async (anggota) => {
          if (!anggota.id) {
            throw new Error(
              `Anggota keluarga ${anggota.namaLengkap} tidak memiliki ID penduduk.`,
            )
          }

          await createAnggotaKeluarga({
            ...anggota,
            pendudukId: anggota.id,
            kartuKeluargaId: kartuKeluargaId,
          })
        }),
      )
    },
    [anggotaList, createAnggotaKeluarga],
  )

  const handleSubmit = React.useCallback(
    async ({ value }: { value: z.infer<typeof combinedSchema> }) => {
      if (!selectedKepalaKeluarga?.id) {
        toast({
          title: "Validasi Gagal",
          description: "Anda harus memilih seorang Kepala Keluarga.",
        })
        return
      }

      try {
        const kartuKeluargaData = await handleCreateKartuKeluarga(
          value.kartuKeluarga,
        )

        await handleCreateKepalaKeluarga(
          kartuKeluargaData.id,
          value.kepalaKeluarga,
        )

        if (anggotaList.length > 0) {
          await handleCreateAnggotaList(kartuKeluargaData.id)
        }

        toast({
          description: "Berhasil membuat kartu keluarga beserta anggotanya.",
        })

        if (isDialog) {
          router.back()
          await invalidateKartuKeluargasKey()
        } else {
          router.push("/dashboard/kartu-keluarga")
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Gagal submit:", error)
        toast({
          description: "Terjadi kesalahan saat menyimpan data.",
        })
      }
    },
    [
      selectedKepalaKeluarga,
      anggotaList,
      isDialog,
      router,
      toast,
      handleCreateKartuKeluarga,
      handleCreateKepalaKeluarga,
      handleCreateAnggotaList,
      invalidateKartuKeluargasKey,
    ],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: combinedSchema,
    },
    onSubmit: handleSubmit,
  })

  const handleAddAnggota = () => {
    if (!selectedAnggota || !selectedShdk) {
      toast({
        title: "Gagal Menambah",
        description: "Silakan cari penduduk dan pilih SHDK terlebih dahulu.",
      })
      return
    }

    if (selectedAnggota.id === selectedKepalaKeluarga?.id) {
      toast({
        title: "Gagal Menambah",
        description: "Penduduk ini sudah dipilih sebagai Kepala Keluarga.",
      })
      return
    }

    const isAlreadyInList = anggotaList.some(
      (anggota) => anggota.id === selectedAnggota.id,
    )
    if (isAlreadyInList) {
      toast({
        title: "Gagal Menambah",
        description: "Penduduk ini sudah ada di dalam daftar anggota.",
      })
      return
    }

    const newAnggota = {
      ...selectedAnggota,
      shdk: selectedShdk,
    }
    setAnggotaList((prev) => [...prev, newAnggota])

    setSelectedAnggota(null)
    setSelectedShdk("")
    setAnggotaSearchKey("")
  }

  const handleEditClick = React.useCallback((index: number) => {
    setEditingAnggotaIndex(index)
    setShowEditAnggotaModal(true)
  }, [])

  const handleDeleteClick = React.useCallback((index: number) => {
    setAnggotaList((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
        className="max-w-md space-y-6"
      >
        <section className="space-y-6 p-4">
          <h2 className="mb-4 text-lg font-semibold">Kartu Keluarga</h2>
          <form.AppField name="kartuKeluarga.nomorKartuKeluarga">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Nomor Kartu Keluarga</form.FormLabel>
                <field.BaseField placeholder="Masukkan nomor KK" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="kartuKeluarga.kategoriPenduduk">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Kategori Penduduk</form.FormLabel>
                <field.SelectField
                  mode={isDialog ? "inline" : "portal"}
                  options={KATEGORI_PENDUDUK.map((item) => ({
                    label: item.replace(/_/g, " ").toUpperCase(),
                    value: item,
                  }))}
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>
          <form.AppField name="kartuKeluarga.alamat">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Alamat</form.FormLabel>
                <field.TextareaField placeholder="Isi Alamat" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>
          <form.Subscribe
            selector={(state) => [state.values.kartuKeluarga.kategoriPenduduk]}
          >
            {([kategoriPenduduk]) => {
              const showAlamatLuar =
                kategoriPenduduk === "penduduk_luar_desa" ||
                kategoriPenduduk === "penduduk_luar_berdomisili_di_desa"

              const showAlamatDomisili =
                kategoriPenduduk === "penduduk_dalam_desa" ||
                kategoriPenduduk === "penduduk_luar_berdomisili_di_desa"

              return (
                <>
                  {showAlamatLuar && (
                    <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
                      <form.AppField name="kartuKeluarga.provisi">
                        {(field) => (
                          <form.FormItem>
                            <form.FormLabel>Provinsi</form.FormLabel>
                            <field.BaseField placeholder="Pilih Provinsi" />
                            <form.FormMessage />
                          </form.FormItem>
                        )}
                      </form.AppField>
                      <form.AppField name="kartuKeluarga.kabupaten_kota">
                        {(field) => (
                          <form.FormItem>
                            <form.FormLabel>Kabupaten / Kota</form.FormLabel>
                            <field.BaseField placeholder="Pilih Kabupaten/Kota" />
                            <form.FormMessage />
                          </form.FormItem>
                        )}
                      </form.AppField>
                      <form.AppField name="kartuKeluarga.kecamatan">
                        {(field) => (
                          <form.FormItem>
                            <form.FormLabel>Kecamatan</form.FormLabel>
                            <field.BaseField placeholder="Pilih Kecamatan" />
                            <form.FormMessage />
                          </form.FormItem>
                        )}
                      </form.AppField>
                      <form.AppField name="kartuKeluarga.desa_kelurahan">
                        {(field) => (
                          <form.FormItem>
                            <form.FormLabel>Desa / Kelurahan</form.FormLabel>
                            <field.BaseField placeholder="Pilih Kelurahan / Desa" />
                            <form.FormMessage />
                          </form.FormItem>
                        )}
                      </form.AppField>
                    </div>
                  )}

                  {showAlamatDomisili && (
                    <div className="space-y-4 pt-4">
                      <h3 className="text-md font-semibold text-gray-700">
                        Data Domisili saat ini
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <form.AppField name="kartuKeluarga.dusun">
                          {(field) => (
                            <form.FormItem>
                              <form.FormLabel>Dusun</form.FormLabel>
                              <field.BaseField placeholder="Pilih Dusun" />
                              <form.FormMessage />
                            </form.FormItem>
                          )}
                        </form.AppField>
                        <form.AppField name="kartuKeluarga.rw">
                          {(field) => (
                            <form.FormItem>
                              <form.FormLabel>RW</form.FormLabel>
                              <field.BaseField
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Pilih RW"
                              />
                              <form.FormMessage />
                            </form.FormItem>
                          )}
                        </form.AppField>
                        <form.AppField name="kartuKeluarga.rt">
                          {(field) => (
                            <form.FormItem>
                              <form.FormLabel>RT</form.FormLabel>
                              <field.BaseField
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Pilih RT"
                              />
                              <form.FormMessage />
                            </form.FormItem>
                          )}
                        </form.AppField>
                      </div>
                    </div>
                  )}
                </>
              )
            }}
          </form.Subscribe>
        </section>
        <section className="mt-8 space-y-6 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-lg font-semibold">Kepala Keluarga</h2>
            {selectedKepalaKeluarga && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedKepalaKeluarga(null)
                  setSearchKey("")
                  form.resetField("kepalaKeluarga")
                }}
              >
                Ganti Kepala Keluarga
              </Button>
            )}
          </div>

          {!selectedKepalaKeluarga && (
            <form.AppField name="kepalaKeluarga.id">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>
                    Cari dan Pilih Kepala Keluarga
                  </form.FormLabel>
                  <ComboboxPopover
                    mode={isDialog ? "inline" : "portal"}
                    popoverClassName="w-lg max-w-sm lg:max-w-md"
                    onInputValueChange={(value) => {
                      setSearchKey(value)
                    }}
                    onValueChange={(val) => {
                      const selected = pendudukOptionsRaw.find(
                        (p) => p.value === val,
                      )
                      if (selected) {
                        setSelectedKepalaKeluarga({
                          ...selected,
                          shdk: "kepala_keluarga",
                          asalPenduduk:
                            selected.asalPenduduk ?? "penduduk_desa",
                          dusun: selected.dusun ?? "",
                        })
                        field.setValue(selected.value)

                        Object.entries(selected).forEach(([key, val]) => {
                          if (key in pendudukSchema.shape) {
                            const valueToSet = val ?? undefined

                            form.setFieldValue(
                              `kepalaKeluarga.${key as PendudukKey}`,
                              valueToSet,
                            )
                          }
                        })
                        form.setFieldValue(
                          "kepalaKeluarga.shdk",
                          "kepala_keluarga",
                        )
                      }
                    }}
                    isClearable={true}
                    onClear={() => {
                      setSelectedKepalaKeluarga(null)
                      field.setValue(undefined)
                      setSearchKey("")
                      form.resetField("kepalaKeluarga")
                    }}
                    items={pendudukOptions}
                    placeholder="Cari Nama penduduk..."
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>
          )}

          {selectedKepalaKeluarga && (
            <div className="space-y-6 pt-4">
              <form.AppField name="kepalaKeluarga.namaLengkap">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Nama Lengkap</form.FormLabel>
                    <field.BaseField disabled />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.nik">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>NIK</form.FormLabel>
                    <field.BaseField disabled />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.tempatLahir">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Tempat Lahir</form.FormLabel>
                    <field.BaseField
                      disabled
                      placeholder="Masukkan tempat lahir"
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.tanggalLahir">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Tanggal Lahir</form.FormLabel>
                    <field.DatePickerField
                      disabled
                      mode={isDialog ? "inline" : "portal"}
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.jenisKelamin">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Jenis Kelamin</form.FormLabel>
                    <field.SelectField
                      disabled
                      mode={isDialog ? "inline" : "portal"}
                      options={[
                        { label: "Laki-laki", value: "laki-laki" },
                        { label: "Perempuan", value: "perempuan" },
                      ]}
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.agama">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Agama</form.FormLabel>
                    <field.SelectField
                      disabled
                      mode={isDialog ? "inline" : "portal"}
                      options={AGAMA.map((item) => ({
                        label: item.replace(/_/g, " ").toUpperCase(),
                        value: item,
                      }))}
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.pendidikanTerakhir">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Pendidikan Terakhir</form.FormLabel>
                    <field.SelectField
                      disabled
                      mode={isDialog ? "inline" : "portal"}
                      options={PENDIDIKAN_TERAKHIR.map((item) => ({
                        label: item.replace(/_/g, " ").toUpperCase(),
                        value: item,
                      }))}
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.pekerjaan">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Pekerjaan</form.FormLabel>
                    <field.SelectField
                      disabled
                      mode={isDialog ? "inline" : "portal"}
                      options={JENIS_PEKERJAAN.map((item) => ({
                        label: item.replace(/_/g, " ").toUpperCase(),
                        value: item,
                      }))}
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.statusPerkawinan">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Status Perkawinan</form.FormLabel>
                    <field.SelectField
                      disabled
                      mode={isDialog ? "inline" : "portal"}
                      options={STATUS_PERKAWINAN.map((item) => ({
                        label: item.replace(/_/g, " ").toUpperCase(),
                        value: item,
                      }))}
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.statusDomisili">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Status Domisili</form.FormLabel>
                    <field.SelectField
                      disabled
                      mode={isDialog ? "inline" : "portal"}
                      options={STATUS_DOMISILI.map((item) => ({
                        label: item.replace(/_/g, " ").toUpperCase(),
                        value: item,
                      }))}
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.asalPenduduk">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Asal Penduduk</form.FormLabel>
                    <field.SelectField
                      disabled
                      mode={isDialog ? "inline" : "portal"}
                      options={ASAL_PENDUDUK.map((item) => ({
                        label: item.replace(/_/g, " ").toUpperCase(),
                        value: item,
                      }))}
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.alamat">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Alamat</form.FormLabel>
                    <field.TextareaField
                      disabled
                      placeholder="Masukkan alamat lengkap"
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.rt">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>RT</form.FormLabel>
                    <field.BaseField disabled placeholder="Contoh: 01" />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.rw">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>RW</form.FormLabel>
                    <field.BaseField disabled placeholder="Contoh: 02" />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.provinsi">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Provinsi</form.FormLabel>
                    <field.BaseField disabled placeholder="Masukkan provinsi" />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.kabupaten_kota">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Kabupaten/Kota</form.FormLabel>
                    <field.BaseField
                      disabled
                      placeholder="Masukkan kabupaten atau kota"
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.kecamatan">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Kecamatan</form.FormLabel>
                    <field.BaseField
                      disabled
                      placeholder="Masukkan kecamatan"
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.desa_kelurahan">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Desa/Kelurahan</form.FormLabel>
                    <field.BaseField
                      disabled
                      placeholder="Masukkan desa atau kelurahan"
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.dusun">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Dusun</form.FormLabel>
                    <field.BaseField
                      disabled
                      placeholder="Masukkan dusun (opsional)"
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.namaAyahKandung">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Nama Ayah Kandung</form.FormLabel>
                    <field.BaseField
                      disabled
                      placeholder="Masukkan nama ayah"
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.namaIbuKandung">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Nama Ibu Kandung</form.FormLabel>
                    <field.BaseField disabled placeholder="Masukkan nama ibu" />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.bantuanSosial">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Bantuan Sosial</form.FormLabel>
                    <field.CheckboxField
                      disabled
                      label="Menerima bantuan sosial"
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>

              <form.AppField name="kepalaKeluarga.disabilitas">
                {(field) => (
                  <form.FormItem>
                    <form.FormLabel>Disabilitas</form.FormLabel>
                    <field.CheckboxField
                      disabled
                      label="Memiliki disabilitas"
                    />
                    <form.FormMessage />
                  </form.FormItem>
                )}
              </form.AppField>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Anggota Keluarga</h2>
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-md font-medium">Cari dan Tambah Anggota</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cari Penduduk</label>
              <ComboboxPopover
                mode={isDialog ? "inline" : "portal"}
                selectedLabel={selectedAnggota?.label}
                onInputValueChange={setAnggotaSearchKey}
                onValueChange={(val) => {
                  const selected = anggotaPendudukOptionsRaw.find(
                    (p) => p.value === val,
                  )
                  if (selected)
                    setSelectedAnggota({
                      ...selected,
                      asalPenduduk: selected.asalPenduduk ?? "penduduk_desa",
                      dusun: selected.dusun ?? "",
                    })
                }}
                isClearable={true}
                onClear={() => setSelectedAnggota(null)}
                items={anggotaPendudukOptionsRaw}
                placeholder="Cari NIK atau Nama penduduk..."
                value={selectedAnggota?.value}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status Hubungan Dalam Keluarga (SHDK)
              </label>

              <Select
                collection={shdkCollection}
                value={selectedShdk ? [selectedShdk] : []}
                onValueChange={(e) => {
                  const newValue = e.value[0] ?? ""
                  setSelectedShdk(newValue as SHDK | "")
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValueText placeholder="Pilih SHDK" />
                </SelectTrigger>
                <SelectContent mode={isDialog ? "inline" : "portal"}>
                  <SelectItemGroup>
                    {shdkCollection.items.map((item) => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectItemGroup>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={handleAddAnggota}>
              <Icon name="Plus" className="mr-2" />
              Tambah ke Daftar
            </Button>
          </div>

          {anggotaList.length > 0 && (
            <ul className="divide-mute divide-y rounded-md border">
              {anggotaList.map((anggota, index) => {
                if (anggota.shdk !== "kepala_keluarga") {
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="text-sm">
                        <p className="font-medium">{anggota.namaLengkap}</p>
                        <p className="text-muted-foreground">
                          {anggota.nik} -{" "}
                          {anggota.shdk.replace(/_/g, " ").toUpperCase()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(index)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </li>
                  )
                }
                return null
              })}
            </ul>
          )}
        </section>

        <form.FormItem>
          <Button type="submit">Simpan</Button>
        </form.FormItem>
      </form>

      {editingAnggotaIndex !== null && (
        <FormAnggotaKeluargaDialog
          key="edit-anggota-keluarga"
          mode="edit"
          open={showEditAnggotaModal}
          onClose={() => {
            setShowEditAnggotaModal(false)
            setEditingAnggotaIndex(null)
          }}
          onSubmit={(editedAnggota) => {
            setAnggotaList((prev) =>
              prev.map((item, index) =>
                index === editingAnggotaIndex ? editedAnggota : item,
              ),
            )
            setShowEditAnggotaModal(false)
            setEditingAnggotaIndex(null)
          }}
          initialValues={anggotaList[editingAnggotaIndex]}
          defaultValues={defaultValues.kepalaKeluarga}
        />
      )}
    </div>
  )
}
