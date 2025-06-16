"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type IconProps } from "@yopem-ui/react-icons"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuItemCollapsible,
} from "@/components/ui/sidebar"

interface NavCollapsibleProps
  extends React.ComponentProps<typeof SidebarGroup> {
  items: {
    name: string
    url: string
    icon: IconProps["name"]
  }[]
  label: string
}

const NavCollapsible = (props: NavCollapsibleProps) => {
  const pathname = usePathname()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{props.label}</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItemCollapsible label={props.label} defaultOpen>
          {props.items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={pathname.includes(item.url)}
                tooltip={item.name}
              >
                <Link href={item.url}>
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenuItemCollapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavCollapsible
