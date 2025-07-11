import { db } from "@pintudesa/db"

import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server"
import ServerStatus from "./server-status"

export default async function StatusPage() {
  prefetch(trpc.healthCheck.queryOptions())
  const users = await db.query.userTable.findMany()
  return (
    <HydrateClient>
      <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <ServerStatus />
          </div>
          {users.length > 0 && (
            <div className="flex flex-col space-y-2 text-center">
              <h2 className="text-2xl font-semibold">Users</h2>
              <ul className="list-inside list-disc">
                {users.map((u) => (
                  <li key={u.id}>{u.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </HydrateClient>
  )
}
