import { Separator, SidebarTrigger } from "@/lib/ui"

import ThemeSwitcher from "@/components/dashboard/theme/theme-switcher"
import Breadcrumb from "./breadcrumb"
import Notifications from "./notifications"
import Search from "./search"

/**
 * Topbar component for the panel application
 * Includes navigation breadcrumbs, search, notifications, sidebar trigger, and theme switcher
 */
export default function Topbar() {
  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b px-4">
      {/* Left section: Sidebar trigger and breadcrumbs */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator orientation="vertical" className="h-4" />
        <div className="hidden md:block">
          <Breadcrumb />
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden flex-1 md:block" />

      {/* Right section: Search, notifications and theme switcher */}
      <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
        <Search />
        <Separator orientation="vertical" className="h-4" />
        <Notifications />
        <Separator orientation="vertical" className="h-4" />
        <ThemeSwitcher />
      </div>
    </header>
  )
}
