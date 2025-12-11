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
    <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <Icon name="Shield" className="size-8" />
            </div>
            <div>
              <h1 className="text-foreground text-lg font-bold">Desa {desa}</h1>
              <p className="text-muted-foreground text-sm">
                Kecamatan {kecamatan}
              </p>
            </div>
          </div>

          <nav className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              className="text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="outline">Pengaduan</Button>
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
                    className="text-foreground hover:bg-muted rounded-md px-4 py-2 font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="space-y-2 px-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Pengaduan
                  </Button>
                </div>
                <div className="px-4">
                  <ThemeSwitcher />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
