import { useMutation, useQuery, type UseQueryResult } from '@tanstack/react-query'

import {
  ITProductListService,
  ITProductDetailService,
  ITProductCreateService,
  ITProductUpdateService,
  ITProductDeleteService,
  type ITProductPayload,
} from '@/services/itProduct'

export const useITProduct = (search: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['it_product_list', search],
    queryFn: async () => {
      try {
        const { data, status } = await ITProductListService(search)

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

export const useITProductDetail = (id?: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['it_product_detail', id],
    queryFn: async () => {
      try {
        const { data, status } = await ITProductDetailService(id!)

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

export const useITProductCreate = () => {
  return useMutation({
    mutationKey: ['create_it_product'],
    mutationFn: async (payload: ITProductPayload) => {
      try {
        const response: any = await ITProductCreateService(payload)

        if (response.status !== 201) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Create IT Product')
      }
    },
  })
}

export const useITProductUpdate = () => {
  return useMutation({
    mutationKey: ['update_it_product'],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: ITProductPayload
    }) => {
      try {
        const response: any = await ITProductUpdateService(id, payload)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Update IT Product')
      }
    },
  })
}

export const useITProductDelete = () => {
  return useMutation({
    mutationKey: ['delete_it_product'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await ITProductDeleteService(id)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Delete IT Product')
      }
    },
  })
}