import { slugifyUsername } from "@pintudesa/utils"
import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { accountTable, userTable, type InsertUser } from "../schema/user"

interface InsertUserProps extends Omit<InsertUser, "username"> {
  providerAccountId: string
}

export const insertUser = async (data: InsertUserProps) => {
  const user = await db
    .insert(userTable)
    .values({
      ...data,
      username: await generateUniqueUsername(data.name!),
    })
    .returning()

  await db.insert(accountTable).values({
    provider: "google",
    providerAccountId: data.providerAccountId,
    userId: user[0].id,
  })

  return user[0]
}

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

export const getExistingUser = async (providerAccountId: string) => {
  return await db.query.accountTable.findFirst({
    where: (accounts, { and, eq }) =>
      and(
        eq(accounts.providerAccountId, providerAccountId),
        eq(accounts.provider, "google"),
      ),
  })
}

export const getUserById = async (id: string) => {
  return await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  })
}

export const getUserByUsername = async (username: string) => {
  return await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.username, username),
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
          ilike(users.username, `%${searchQuery}%`),
        ),
      ),
    limit: limit,
  })
}

export const countUsers = async () => {
  const users = await db.select({ value: count() }).from(userTable)
  return users[0]?.value ?? 0
}

export const generateUniqueUsername = async (name: string): Promise<string> => {
  const username = slugifyUsername(name)
  let uniqueUsername = username
  let suffix = 1

  while (
    await db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.username, uniqueUsername),
    })
  ) {
    suffix++
    uniqueUsername = `${username}${suffix}`
  }

  return uniqueUsername
}
