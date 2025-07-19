import "@/styles/globals.css"

import { type Metadata } from "next"
import { Manrope } from "next/font/google"
import { siteDescription, siteTagline, siteTitle } from "@pintudesa/env"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import Providers from "@/components/providers"
import { createApi } from "@/lib/trpc/server"

export async function generateMetadata(): Promise<Metadata> {
  const api = await createApi()

  const title = (await api.setting.byKey("siteTitle")) ?? siteTitle!
  const tagline = (await api.setting.byKey("siteTagline")) ?? siteTagline!
  const description =
    (await api.setting.byKey("siteDescription")) ?? siteDescription!

  return {
    title: { default: title, template: `%s - ${tagline}` },
    description: description,
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  }
}

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
})

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const api = await createApi()
  const title = await api.setting.byKey("siteTitle")
  const kecamatan = await api.setting.byKey("kecamatan")

  return (
    <html lang="en" className={`${manrope.className}`} suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen">
            <Header title={title!} kecamatan={kecamatan!} />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
