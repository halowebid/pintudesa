import "@/styles/globals.css"

import { type Metadata } from "next"
import { Manrope } from "next/font/google"

import Providers from "@/components/providers"
import { ToastProvider } from "@/components/toast-provider"
import { siteDescription, siteTagline, siteTitle } from "@/lib/env/client"

export const metadata: Metadata = {
  title: `${siteTitle} - ${siteTagline}`,
  description: siteDescription,
  icons: [{ rel: "icon", url: "/favicon.png" }],
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
