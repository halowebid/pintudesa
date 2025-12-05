"use client"

import * as React from "react"
import { useMutation } from "@tanstack/react-query"

import { useToast } from "@/components/toast-provider"
import ShowOptions from "@/components/ui/show-options"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TablePagination from "@/components/ui/table-pagination"
import UserRoleBadge from "@/components/ui/user-role-badge"
import type { SelectUser } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { formatDate } from "@/lib/utils"
import { useHandleTRPCError } from "@/lib/utils/error"

interface UserTableProps {
  users: SelectUser[]
  paramsName: string
  page: number
  lastPage: number
  updateUsers: () => void
  updateUsersCount: () => void
}

export default function UserTable(props: UserTableProps) {
  const { users, paramsName, page, lastPage, updateUsers, updateUsersCount } =
    props

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()

  const { mutate: deleteUser } = useMutation(
    trpc.user.delete.mutationOptions({
      onSuccess: () => {
        updateUsers()
        updateUsersCount()
        toast({
          description: "Berhasil menghapus pengguna",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus pengguna")
      },
    }),
  )

  return (
    <div className="relative min-h-[100vh] w-full overflow-auto">
      <Table className="table-auto border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              Email
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              Role
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              Tanggal Bergabung
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {user.name}
                    </span>
                    <span className="text-muted-foreground table-cell text-[10px] lg:hidden">
                      <span className="uppercase">{user.role}</span>
                      <span className="pr-1">,</span>
                      <span>{user.email}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden font-medium text-ellipsis">
                      {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">
                    <UserRoleBadge role={user.role}>{user.role}</UserRoleBadge>
                  </div>
                </TableCell>
                <TableCell className="hidden align-middle whitespace-nowrap lg:table-cell">
                  <div className="flex">{formatDate(user.createdAt, "LL")}</div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <ShowOptions
                    onDelete={() => {
                      deleteUser(user.id)
                    }}
                    editUrl={`/user/edit/${user.id}`}
                    viewUrl={`/user/${user.id}`}
                    description={user.name}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {lastPage ? (
        <TablePagination
          currentPage={page}
          lastPage={lastPage}
          paramsName={paramsName}
        />
      ) : null}
    </div>
  )
}
