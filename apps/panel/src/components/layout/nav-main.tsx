"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@pintudesa/ui"
import { Icon, type IconProps } from "@yopem-ui/react-icons"

interface NavMainProps extends React.ComponentProps<typeof SidebarGroup> {
  items: {
    name: string
    url: string
    icon: IconProps["name"]
  }[]
}

const NavMain = (props: NavMainProps) => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Items</SidebarGroupLabel>
      <SidebarMenu>
        {props.items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <Icon name={item.icon} />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain
