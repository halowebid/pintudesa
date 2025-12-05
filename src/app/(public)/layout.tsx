import Footer from "@/components/web/layout/footer"
import Header from "@/components/web/layout/header"
import { getSession } from "@/lib/auth/server"
import { createApi } from "@/lib/trpc/server"

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const api = await createApi()
  const session = await getSession()
  const desa = await api.setting.byKey("desa")
  const kecamatan = await api.setting.byKey("kecamatan")

  return (
    <div className="min-h-screen">
      <Header desa={desa!} kecamatan={kecamatan!} user={session?.user} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
