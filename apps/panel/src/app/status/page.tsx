import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server"
import ServerStatus from "./server-status"

export default function StatusPage() {
  prefetch(trpc.healthCheck.queryOptions())
  return (
    <HydrateClient>
      <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <ServerStatus />
          </div>
        </div>
      </div>
    </HydrateClient>
  )
}
