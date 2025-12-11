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
    <div className="bg-background relative flex min-h-screen flex-col font-sans antialiased">
      <div className="bg-background absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]"></div>
      <Header desa={desa!} kecamatan={kecamatan!} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
