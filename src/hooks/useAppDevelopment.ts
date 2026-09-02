import { useMutation, useQuery, type UseQueryResult } from '@tanstack/react-query'

import {
  AppDevelopmentListService,
  AppDevelopmentDetailService,
  AppDevelopmentCreateService,
  AppDevelopmentUpdateService,
  AppDevelopmentDeleteService,
  type AppDevelopmentPayload,
} from '@/services/appDevelopment'

export const useAppDevelopment = (search: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['app_development_list', search],
    queryFn: async () => {
      try {
        const { data, status } = await AppDevelopmentListService(search)

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

export const useAppDevelopmentDetail = (id?: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['app_development_detail', id],
    queryFn: async () => {
      try {
        const { data, status } = await AppDevelopmentDetailService(id!)

        if (status !== 200) return null

        return data
      } catch (e) {
        return null
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  })

  return queryResult
}

export const useAppDevelopmentCreate = () => {
  return useMutation({
    mutationKey: ['create_app_development'],
    mutationFn: async (payload: AppDevelopmentPayload) => {
      try {
        const response: any = await AppDevelopmentCreateService(payload)

        if (response.status !== 201) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Create App Development')
      }
    },
  })
}

export const useAppDevelopmentUpdate = () => {
  return useMutation({
    mutationKey: ['update_app_development'],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: AppDevelopmentPayload
    }) => {
      try {
        const response: any = await AppDevelopmentUpdateService(id, payload)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Update App Development')
      }
    },
  })
}

export const useAppDevelopmentDelete = () => {
  return useMutation({
    mutationKey: ['delete_app_development'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await AppDevelopmentDeleteService(id)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Delete App Development')
      }
    },
  })
}