import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { userTable, type InsertUser } from "../schema/user"

interface UpdateUserProps extends InsertUser {
  id: string
}

/**
 * Update an existing user
 *
 * @param data - The user data to update, including the id
 * @returns The updated user entry
 */
export const updateUser = async (data: UpdateUserProps) => {
  const berita = await db
    .update(userTable)
    .set(data)
    .where(eq(userTable.id, data.id))
    .returning()

  return berita[0]
}

/**
 * Delete a user by ID
 *
 * @param id - The ID of the user to delete
 * @returns The deleted user entry
 */
export const deleteUser = async (id: string) => {
  const user = await db
    .delete(userTable)
    .where(eq(userTable.id, id))
    .returning()
  return user[0]
}

/**
 * Get paginated list of users
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of users per page
 * @returns Array of user entries ordered by creation date
 */
export const getUsers = async (page: number, perPage: number) => {
  return await db.query.userTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single user by ID
 *
 * @param id - The ID of the user
 * @returns The user if found, undefined otherwise
 */
export const getUserById = async (id: string) => {
  return await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  })
}

/**
 * Search users by name or email with limit
 *
 * @param searchQuery - The search query string to match against name or email
 * @param limit - Maximum number of results to return
 * @returns Array of matching user entries
 */
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

/**
 * Get total count of all users
 *
 * @returns The total number of user entries
 */
export const countUsers = async () => {
  const users = await db.select({ value: count() }).from(userTable)
  return users[0]?.value ?? 0
}
