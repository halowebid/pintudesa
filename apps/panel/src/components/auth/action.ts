"use server"

import { logout } from "@pintudesa/auth"

export async function handleLogOut() {
  return await logout()
}
