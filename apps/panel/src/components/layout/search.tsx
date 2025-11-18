"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogBackDrop,
  DialogContent,
  DialogPortal,
  DialogPositioner,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@pintudesa/ui"
import { Icon } from "@yopem-ui/react-icons"

import { searchMenuItems } from "@/lib/data/menu"

/**
 * Global search component with keyboard shortcut support
 * Searches across available menu items and pages
 */
export default function Search() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const router = useRouter()

  // Search menu items locally (no API call needed)
  const results = React.useMemo(() => searchMenuItems(query), [query])

  // Group results by category
  const groupedResults = React.useMemo(() => {
    const groups: Record<string, typeof results> = {}
    for (const item of results) {
      const category = item.category
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (groups[category]) {
        groups[category].push(item)
      } else {
        groups[category] = [item]
      }
    }
    return groups
  }, [results])

  // Keyboard shortcut handler (Ctrl+K / Cmd+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleResultClick = (href: string) => {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <button
          className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-ring flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50 md:w-96"
          aria-label="Search"
        >
          <Icon name="Search" className="h-4 w-4" />
          <span className="hidden md:inline">Cari ...</span>
          <kbd className="bg-muted pointer-events-none ml-auto hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none md:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogBackDrop />
        <DialogPositioner>
          <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-hidden">
            <div className="flex items-center border-b px-4 py-3">
              <Icon
                name="Search"
                className="mr-2 h-4 w-4 shrink-0 opacity-50"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari halaman atau menu..."
                className="placeholder:text-muted-foreground flex h-10 w-full rounded-md border-0 bg-transparent text-sm shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                autoFocus
              />
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {query && results.length === 0 && (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  Tidak ada hasil ditemukan untuk "{query}".
                </div>
              )}

              {!query && (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  Ketik untuk mencari halaman atau menu...
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-3">
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category}>
                      <div className="text-muted-foreground px-3 py-1.5 text-xs font-semibold">
                        {category}
                      </div>
                      <div className="space-y-0.5">
                        {items.map((item) => (
                          <button
                            key={item.url}
                            onClick={() => handleResultClick(item.url)}
                            className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors"
                          >
                            <Icon
                              name="FileText"
                              className="text-muted-foreground h-4 w-4"
                            />
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogTitle className="sr-only">Pencarian Menu</DialogTitle>
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </Dialog>
  )
}
