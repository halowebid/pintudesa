"use client"

import { usePathname } from "next/navigation"
import { Icon } from "@yopem-ui/react-icons"

import Link from "@/components/ui/link"
import { generateBreadcrumbs } from "@/lib/utils/breadcrumb"

/**
 * Breadcrumb component that displays the current page location
 * in the application hierarchy
 */
export default function Breadcrumb() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname ?? "")

  if (breadcrumbs.length === 1) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{breadcrumbs[0].label}</span>
      </div>
    )
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2">
      <ol className="flex items-center gap-2">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={breadcrumb.href} className="flex items-center gap-2">
              {index > 0 && (
                <Icon
                  name="ChevronRight"
                  className="text-muted-foreground h-4 w-4"
                />
              )}
              {isLast ? (
                <span className="text-sm font-medium">{breadcrumb.label}</span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
