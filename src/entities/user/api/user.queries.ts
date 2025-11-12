import { queryOptions } from '@tanstack/react-query'
import { mapUser } from './mapper/user.mapper'
import { getUserById } from './user.service'

export const USER_ROOT_QUERY_KEY = ['users']

export const userQueries = {
  all: () => [...USER_ROOT_QUERY_KEY],

  user: (id: string) =>
    queryOptions({
      queryKey: [...USER_ROOT_QUERY_KEY, 'user', id],
      queryFn: async ({ signal }) => {
        const { data } = await getUserById(id, { signal })
        const user = mapUser(data)
        return user
      },
    }),
}

