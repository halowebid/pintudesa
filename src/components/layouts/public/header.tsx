"use client"

import * as React from "react"
import { Icon } from "@yopem-ui/react-icons"

import { Button } from "@/components/ui/button"
import Link from "@/components/ui/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ThemeSwitcher from "@/components/ui/theme-switcher"

const Header = ({ desa, kecamatan }: { desa: string; kecamatan: string }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Profil", href: "/profile" },
    { label: "Statistik", href: "/statistics" },
  ]

  return (
    <header className="bg-background/95 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-green-600 p-2">
              <Icon name="Shield" className="text-foreground size-8" />
            </div>
            <div>
              <h1 className="text-foreground text-lg font-bold">Desa {desa}</h1>
              <p className="text-accent-foreground text-sm">
                Kecamatan {kecamatan}
              </p>
            </div>
          </div>

          <nav className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-foreground font-medium transition-colors hover:text-green-600"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="text-foreground font-medium transition-colors hover:text-green-600"
            >
              Dashboard
            </Link>
            <Button className="bg-pink-500 text-white hover:bg-pink-600">
              Pengaduan
            </Button>
            <ThemeSwitcher />
          </nav>

          <Sheet
            open={isOpen}
            onOpenChange={(details) => setIsOpen(details.open)}
          >
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Icon name="Menu" className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="mt-8 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-foreground px-4 py-2 font-medium transition-colors hover:text-green-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/dashboard"
                  className="text-foreground px-4 py-2 font-medium transition-colors hover:text-green-600"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Button className="m-4 bg-pink-500 hover:bg-pink-600">
                  Pengaduan
                </Button>
                <ThemeSwitcher />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
