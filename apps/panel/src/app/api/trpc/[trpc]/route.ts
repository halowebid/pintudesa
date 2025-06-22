import { type NextRequest } from "next/server"
import { appRouter, createTRPCContext } from "@pintudesa/api"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { appEnv } from "@/lib/utils/env"

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  })
}

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      appEnv === "development"
        ? ({ path, error }) => {
            // eslint-disable-next-line no-console
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            )
          }
        : undefined,
  })

export { handler as GET, handler as POST }
