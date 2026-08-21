import { useMutation, useQuery, type UseQueryResult } from '@tanstack/react-query'

import {
  DeleteService,
  RegisterService,
  UserListService,
  UpdateService,
} from '@/services/users'

export const useUser = (search: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['user_list', search],
    queryFn: async () => {
      try {
        const { data, status } = await UserListService(search)

        if (status !== 200) throw new Error()

        return data
      } catch (e) {
        return []
      }
    },
    refetchOnWindowFocus: false,
  })

  return queryResult
}

export const useRegister = () => {
  return useMutation({
    mutationKey: ['register_user'],
    mutationFn: async (payload: {
      username: string
      password: string
      display_name: string
    }) => {
      try {
        const response: any = await RegisterService(payload)

        if (response.status !== 201) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Register User')
      }
    },
  })
}

export const useUpdate = () => {
  return useMutation({
    mutationKey: ['update_user'],
    mutationFn: async (payload: {
      _id: string
      username: string
      password: string
      display_name: string
    }) => {
      try {
        const response: any = await UpdateService(payload)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.message,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Update User')
      }
    },
  })
}

export const useDelete = () => {
  return useMutation({
    mutationKey: ['delete_user'],
    mutationFn: async (payload: string) => {
      try {
        const response: any = await DeleteService(payload)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Delete User')
      }
    },
  })
}