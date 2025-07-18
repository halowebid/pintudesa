"use client"

import * as React from "react"
import { redirect } from "next/navigation"
import { Icon } from "@yopem-ui/react-icons"

import { authClient } from "@/lib/auth/client"

const SignOutButton = () => {
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            redirect("/auth/sign-in")
          },
        },
      })
    })
  }

  return (
    <button
      aria-label="Keluar"
      disabled={isPending}
      onClick={handleSubmit}
      className="inline-flex cursor-pointer flex-row"
    >
      <Icon name="LogOut" className="mr-2" />
      Keluar
    </button>
  )
}

export default SignOutButton
