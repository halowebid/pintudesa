"use client"

import * as React from "react"
import { Icon } from "@yopem-ui/react-icons"

import { handleLogOut } from "./action"

const LogoutButton = () => {
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      await handleLogOut()
    })
  }

  return (
    <form action={handleSubmit}>
      <button
        aria-label="Keluar"
        disabled={isPending}
        className="inline-flex cursor-pointer flex-row"
      >
        <Icon name="LogOut" className="mr-2" />
        Keluar
      </button>
    </form>
  )
}

export default LogoutButton
