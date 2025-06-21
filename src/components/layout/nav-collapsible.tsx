"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type IconProps } from "@yopem-ui/react-icons"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuItemCollapsible,
} from "@/components/ui/sidebar"

interface NavCollapsibleProps extends React.ComponentProps<typeof SidebarMenu> {
  items: {
    name: string
    url: string
    icon?: IconProps["name"]
    disabled?: boolean
  }[]
  label: string
}

const NavCollapsible = (props: NavCollapsibleProps) => {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      <SidebarMenuItemCollapsible label={props.label} defaultOpen>
        {props.items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(item.url)}
              tooltip={item.name}
              disabled={item.disabled}
            >
              <Link href={item.url}>
                <span className="line-clamp-2">{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenuItemCollapsible>
    </SidebarMenu>
  )
}

export default NavCollapsible
