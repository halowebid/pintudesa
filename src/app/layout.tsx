import "@/styles/globals.css"

import { type Metadata } from "next"
import { Manrope } from "next/font/google"

import Providers from "@/components/dashboard/providers"
import { ToastProvider } from "@/components/toast-provider"
import { siteDescription, siteTagline, siteTitle } from "@/lib/env"
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.className}`} suppressHydrationWarning>
      <body>
        <Providers>
          <ToastProvider>{children}</ToastProvider>
        </Providers>
      </body>
    </html>
  )
}
