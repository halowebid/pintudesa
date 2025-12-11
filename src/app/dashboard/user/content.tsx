"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useSuspenseQuery } from "@tanstack/react-query"

import { Skeleton } from "@/components/ui/skeleton"
import { useTRPC } from "@/lib/trpc/client"
import UserTable from "./table"

export default function UserContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const perPage = 10

  const trpc = useTRPC()

  const { data: usersCount, refetch: updateUsersCount } = useSuspenseQuery(
    trpc.user.count.queryOptions(),
  )

  const lastPage = usersCount && Math.ceil(usersCount / perPage)

  const { data: users, refetch: updateUsers } = useSuspenseQuery(
    trpc.user.all.queryOptions({
      page: page ? parseInt(page) : 1,
      perPage: perPage,
    }),
  )

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  if (users?.length === 0 || !usersCount) {
    return (
      <div className="my-64 flex items-center justify-center">
        <Skeleton />
        <h3 className="text-center text-4xl font-bold">
          Pengguna tidak ditemukan!
        </h3>
      </div>
    )
  }

  return (
    <UserTable
      users={users!}
      paramsName="page"
      page={page ? parseInt(page) : 1}
      lastPage={lastPage!}
      updateUsers={updateUsers}
      updateUsersCount={updateUsersCount}
    />
  )
}
