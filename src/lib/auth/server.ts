import "server-only"

import { cache } from "react"
import { headers } from "next/headers"

import { initAuth } from "@/lib/auth"
import { appEnv, authSecret, siteUrl } from "@/lib/env"

const baseUrl = appEnv === "production" ? siteUrl! : "http://localhost:3100"

export const auth = initAuth({
  baseUrl,
  secret: authSecret,
  corsOrigin: baseUrl,
})

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
)
