"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createListCollection, type ListCollection } from "@ark-ui/react"
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import { SHDK, type SelectPenduduk as PendudukType } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  SelectValueText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/ui"

const newKartuKeluargaSchema = z.object({
  nomorKartuKeluarga: z.string().min(1, "Nomor KK wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  dusun: z.string().min(1, "Dusun wajib diisi"),
  rw: z.string().min(1, "RW wajib diisi"),
  rt: z.string().min(1, "RT wajib diisi"),
})

type CombinedMember = PendudukType & {
  shdk: (typeof SHDK)[number]
  anggotaKeluargaId: string
}

type NewKkMember = CombinedMember & {
  newShdk: (typeof SHDK)[number]
}

interface PecahKKFormProps {
  originalKkId: string
  isDialog: boolean
}

export default function PecahKKForm({
  originalKkId,
  isDialog,
}: PecahKKFormProps) {
  const [newKkMembers, setNewKkMembers] = React.useState<NewKkMember[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { toast } = useToast()
  const shdkOptions = SHDK.map((item) => ({
    label: item.replace(/_/g, " ").toUpperCase(),
    value: item,
  }))

  const shdkCollection: ListCollection = createListCollection({
    items: shdkOptions,
  })
  const { data: originalKk, isLoading: isLoadingKk } = useQuery(
    trpc.kartuKeluarga.byId.queryOptions(originalKkId, {
      enabled: !!originalKkId,
    }),
  )

  const anggotaKeluargaRelations = React.useMemo(
    () => originalKk?.anggotaKeluarga ?? [],
    [originalKk],
  )

  const pendudukQueries = useQueries({
    queries: anggotaKeluargaRelations.map((anggota) =>
      trpc.penduduk.byId.queryOptions(anggota.pendudukId, {
        enabled: !!anggota.pendudukId,
      }),
    ),
  })

  const originalMembers = React.useMemo<CombinedMember[]>(() => {
    const allQueriesSuccess = pendudukQueries.every((q) => q.isSuccess)
    if (!allQueriesSuccess || anggotaKeluargaRelations.length === 0) {
      return [] // Kembalikan array kosong jika belum siap
    }

    return anggotaKeluargaRelations
      .map((relasi, index) => {
        const pendudukDetail = pendudukQueries[index]?.data
        if (!pendudukDetail) return null
        return {
          ...pendudukDetail,
          shdk: relasi.shdk,
          anggotaKeluargaId: relasi.id,
        }
      })
      .filter((item): item is CombinedMember => item !== null)
  }, [pendudukQueries, anggotaKeluargaRelations])

  const availableMembers = React.useMemo(() => {
    const newKkMemberNiks = new Set(newKkMembers.map((m) => m.nik))
    return originalMembers.filter((m) => !newKkMemberNiks.has(m.nik))
  }, [originalMembers, newKkMembers])

  const form = useAppForm({
    defaultValues: {
      nomorKartuKeluarga: "",
      alamat: originalKk?.alamat ?? "",
      dusun: originalKk?.dusun ?? "",
      rw: originalKk?.rw ?? "",
      rt: originalKk?.rt ?? "",
    },
    validators: {
      onSubmit: newKartuKeluargaSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      if (newKkMembers.length === 0) {
        toast({
          description: "Pilih minimal satu anggota untuk KK baru.",
        })
        setIsSubmitting(false)
        return
      }
      const kepalaKeluargaCount = newKkMembers.filter(
        (m) => m.newShdk === "kepala_keluarga",
      ).length
      if (kepalaKeluargaCount !== 1) {
        toast({
          description: "Harus ada tepat satu Kepala Keluarga di KK baru.",
        })
        setIsSubmitting(false)
        return
      }

      try {
        const newKkData = {
          ...value,
          kategoriPenduduk:
            originalKk?.kategoriPenduduk ?? "penduduk_dalam_desa",
          provisi: originalKk?.provisi ?? "",
          kabupaten_kota: originalKk?.kabupaten_kota ?? "",
          kecamatan: originalKk?.kecamatan ?? "",
          desa_kelurahan: originalKk?.desa_kelurahan ?? "",
        }

        const newKk = await createKartuKeluarga(newKkData)

        if (!newKk) {
          throw new Error("Kartu Keluarga baru gagal dibuat.")
        }
        const updatePromises = newKkMembers.map((member) =>
          updateAnggotaKeluarga({
            id: member.anggotaKeluargaId,
            kartuKeluargaId: newKk.id,
            shdk: member.newShdk,
          }),
        )
        await Promise.all(updatePromises)

        toast({ description: "Pecah Kartu Keluarga berhasil dibuat." })
        await queryClient.invalidateQueries({
          queryKey: trpc.kartuKeluarga.all.queryKey(),
        })
        await queryClient.invalidateQueries({
          queryKey: trpc.kartuKeluarga.byId.queryKey(originalKkId),
        })

        if (isDialog) router.back()
        else router.push("/dashboard/kartu-keluarga")
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Gagal submit:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const { mutateAsync: createKartuKeluarga } = useMutation(
    trpc.kartuKeluarga.create.mutationOptions(),
  )
  const { mutateAsync: updateAnggotaKeluarga } = useMutation(
    trpc.anggotaKeluarga.update.mutationOptions(),
  )

  const handleSelectMember = (member: CombinedMember) => {
    if (member.shdk === "kepala_keluarga") {
      toast({
        description: "Kepala keluarga tidak bisa ganti kartu keluarga.",
      })
      return
    }
    if (availableMembers.length === 0) {
      toast({
        description: "Semua anggota sudah dipilih untuk KK baru.",
      })
      return
    }
    if (availableMembers.length === 1) {
      toast({
        description:
          "Hanya ada satu anggota yang tersisa, tidak bisa dipindahkan.",
      })
      return
    }
    setNewKkMembers((prev) => [
      ...prev,
      { ...member, newShdk: prev.length === 0 ? "kepala_keluarga" : "anak" },
    ])
  }

  const handleCancelMember = (nik: string) => {
    setNewKkMembers((prev) => prev.filter((m) => m.nik !== nik))
  }

  const handleShdkChange = (nik: string, newShdk: (typeof SHDK)[number]) => {
    setNewKkMembers((prev) =>
      prev.map((m) => (m.nik === nik ? { ...m, newShdk } : m)),
    )
  }

  if (isLoadingKk) {
    return <div>Memuat data keluarga...</div>
  }

  return (
    <div className="max-w-lg space-y-8">
      <header>
        <h1 className="text-xl font-bold">
          Pecah Kartu Keluarga Untuk Nomor KK {originalKk?.nomorKartuKeluarga}
        </h1>
        <p className="mt-1 text-sm">
          Pilih penduduk dari KK lama untuk dipindahkan ke Kartu Keluarga yang
          baru.
        </p>
      </header>

      <section>
        <h2 className="mb-2 text-lg font-semibold">KK Lama</h2>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Pilih</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>SHDK</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableMembers.length > 0 ? (
                availableMembers.map((member) => {
                  const isKepalaKeluarga = member.shdk === "kepala_keluarga"
                  return (
                    <TableRow key={member.nik}>
                      <TableCell>
                        {isKepalaKeluarga ? (
                          ""
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelectMember(member)}
                          >
                            Pilih
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="line-clamp-2 text-ellipsis">
                          {member.nik}
                        </span>
                      </TableCell>
                      <TableCell>{member.namaLengkap}</TableCell>
                      <TableCell className="max-w-[10rem] px-1.5 py-2 !whitespace-normal md:px-3">
                        <span className="line-clamp-2 text-ellipsis">
                          {member.shdk.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Semua anggota telah dipilih.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">KK Baru</h2>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Aksi</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>SHDK Lama</TableHead>
                <TableHead>SHDK Baru</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newKkMembers.length > 0 ? (
                newKkMembers.map((member) => (
                  <TableRow key={member.nik}>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelMember(member.nik)}
                      >
                        Batal
                      </Button>
                    </TableCell>
                    <TableCell>{member.nik}</TableCell>
                    <TableCell className="max-w-[10rem] px-1.5 py-2 !whitespace-normal md:px-3">
                      <span className="line-clamp-2 text-ellipsis">
                        {member.namaLengkap}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[10rem] px-1.5 py-2 !whitespace-normal md:px-3">
                      <span className="line-clamp-2 text-ellipsis">
                        {member.shdk.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        collection={shdkCollection}
                        value={[member.newShdk]}
                        onValueChange={(e) =>
                          handleShdkChange(
                            member.nik,
                            e.value[0] as (typeof SHDK)[number],
                          )
                        }
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Belum ada anggota yang dipilih untuk KK Baru.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Data Kartu Keluarga Baru
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.AppField name="nomorKartuKeluarga">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Nomor KK</form.FormLabel>
                  <field.BaseField placeholder="Masukkan nomor KK baru" />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>
            <form.AppField name="alamat">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Alamat</form.FormLabel>
                  <field.BaseField placeholder="Masukkan alamat" />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <form.AppField name="dusun">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Dusun</form.FormLabel>
                  <field.BaseField placeholder="Pilih Dusun" />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>
            <form.AppField name="rw">
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
            <form.AppField name="rt">
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
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
