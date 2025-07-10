import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { userTable, type InsertUser } from "../schema/user"

interface UpdateUserProps extends InsertUser {
  id: string
}

export const updateUser = async (data: UpdateUserProps) => {
  const berita = await db
    .update(userTable)
    .set(data)
    .where(eq(userTable.id, data.id))
    .returning()

  return berita[0]
}

export const deleteUser = async (id: string) => {
  const user = await db
    .delete(userTable)
    .where(eq(userTable.id, id))
    .returning()
  return user[0]
}

export const getUsers = async (page: number, perPage: number) => {
  return await db.query.userTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getUserById = async (id: string) => {
  return await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  })
}

export const searchUsers = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.userTable.findMany({
    where: (users, { and, or, ilike }) =>
      and(
        or(
          ilike(users.name, `%${searchQuery}%`),
          ilike(users.email, `%${searchQuery}%`),
        ),
      ),
    limit: limit,
  })
}

export const countUsers = async () => {
  const users = await db.select({ value: count() }).from(userTable)
  return users[0]?.value ?? 0
}
