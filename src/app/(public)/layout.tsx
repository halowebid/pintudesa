import Footer from "@/components/layouts/public/footer"
import Header from "@/components/layouts/public/header"
import { createApi } from "@/lib/trpc/server"

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const api = await createApi()
  const desa = await api.setting.byKey("desa")
  const kecamatan = await api.setting.byKey("kecamatan")

  return (
    <div className="bg-background min-h-screen">
      <Header desa={desa!} kecamatan={kecamatan!} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}