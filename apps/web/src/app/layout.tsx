import "@/styles/globals.css"

import { type Metadata } from "next"
import { Manrope } from "next/font/google"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import Providers from "@/components/providers"
import { siteDescription, siteTagline, siteTitle } from "@/lib/utils/env"

export const metadata: Metadata = {
  title: `${siteTitle} - ${siteTagline}`,
  description: siteDescription,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
          <div className="container min-h-screen">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
