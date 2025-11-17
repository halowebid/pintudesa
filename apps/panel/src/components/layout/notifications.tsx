"use client"

import * as React from "react"
import { Badge, Menu, MenuContent, MenuItem, MenuTrigger } from "@pintudesa/ui"
import { Icon } from "@yopem-ui/react-icons"

/**
 * Notifications component with dropdown panel
 * Displays unread count badge and recent notifications
 * TODO: Connect to backend API when notification router is implemented
 */
export default function Notifications() {
  // Placeholder state - will be replaced with tRPC query
  const notifications: Array<{
    id: string
    title: string
    message: string
    createdAt: Date
    read: boolean
  }> = []

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Menu>
      <MenuTrigger asChild>
        <button
          className="hover:bg-accent hover:text-accent-foreground focus:ring-ring relative rounded-md p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label="Notifications"
        >
          <Icon name="Bell" className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-medium"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </button>
      </MenuTrigger>
      <MenuContent className="w-80">
        {notifications.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center text-sm">
            Tidak ada notifikasi
          </div>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              value={notification.id}
              className="flex flex-col items-start gap-1 p-3"
            >
              <div className="flex w-full items-start justify-between gap-2">
                <div className="font-medium">{notification.title}</div>
                {!notification.read && (
                  <div className="bg-primary h-2 w-2 rounded-full" />
                )}
              </div>
              <div className="text-muted-foreground text-xs">
                {notification.message}
              </div>
              <div className="text-muted-foreground text-xs">
                {notification.createdAt.toLocaleDateString("id-ID")}
              </div>
            </MenuItem>
          ))
        )}
      </MenuContent>
    </Menu>
  )
}
