"use client"

import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Icon } from "@yopem-ui/react-icons"

import { useTRPC } from "@/lib/trpc/client"
import { Badge, Menu, MenuContent, MenuItem, MenuTrigger } from "@/lib/ui"

/**
 * Notifications component with dropdown panel
 * Displays unread count badge and recent notifications
 * Polls for new notifications every 30 seconds
 */
export default function Notifications() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: notifications } = useQuery({
    ...trpc.notifikasi.myNotifications.queryOptions({
      page: 1,
      perPage: 10,
    }),
    refetchInterval: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  })

  const { data: unreadCount } = useQuery({
    ...trpc.notifikasi.unreadCount.queryOptions(),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  })

  const { mutate: markAsRead } = useMutation(
    trpc.notifikasi.markAsRead.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: [["notifikasi", "myNotifications"]],
        })
        void queryClient.invalidateQueries({
          queryKey: [["notifikasi", "unreadCount"]],
        })
      },
    }),
  )

  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } = useMutation(
    trpc.notifikasi.markAllAsRead.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: [["notifikasi", "myNotifications"]],
        })
        void queryClient.invalidateQueries({
          queryKey: [["notifikasi", "unreadCount"]],
        })
      },
    }),
  )

  const handleNotificationClick = (notificationId: string, read: boolean) => {
    if (!read) {
      markAsRead({ id: notificationId })
    }
  }

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    markAllAsRead()
  }

  return (
    <Menu>
      <MenuTrigger asChild>
        <button
          className="hover:bg-accent hover:text-accent-foreground focus:ring-ring relative rounded-md p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label="Notifications"
        >
          <Icon name="Bell" className="h-5 w-5" />
          {unreadCount !== undefined && unreadCount > 0 && (
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
        {unreadCount !== undefined && unreadCount > 0 ? (
          <div className="border-border flex items-center justify-between border-b px-3 py-2">
            <span className="text-muted-foreground text-xs font-medium">
              {unreadCount} notifikasi belum dibaca
            </span>
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
              className="text-primary hover:text-primary/80 text-xs font-medium transition-colors disabled:opacity-50"
            >
              {isMarkingAllAsRead ? "Memproses..." : "Tandai semua dibaca"}
            </button>
          </div>
        ) : null}
        {/* Notifications list */}
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              value={notification.id}
              className="flex cursor-pointer flex-col items-start gap-1 p-3"
              onClick={() =>
                handleNotificationClick(notification.id, notification.read)
              }
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
                {notification.createdAt
                  ? new Date(notification.createdAt).toLocaleDateString("id-ID")
                  : ""}
              </div>
            </MenuItem>
          ))
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 p-8 text-center">
            <Icon name="Bell" className="h-8 w-8 opacity-50" />
            <p className="text-sm">Tidak ada notifikasi</p>
          </div>
        )}
      </MenuContent>
    </Menu>
  )
}
