import { useMutation, useQuery, type UseQueryResult } from '@tanstack/react-query'

import {
  ArticleListService,
  ArticleDetailService,
  ArticleCreateService,
  ArticleUpdateService,
  ArticleDeleteService,
  type ArticlePayload,
} from '@/services/article'

export const useArticle = (search: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['article_list', search],
    queryFn: async () => {
      try {
        const { data, status } = await ArticleListService(search)

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

export const useArticleDetail = (id?: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['article_detail', id],
    queryFn: async () => {
      try {
        const { data, status } = await ArticleDetailService(id!)

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

export const useArticleCreate = () => {
  return useMutation({
    mutationKey: ['create_article'],
    mutationFn: async (payload: ArticlePayload) => {
      try {
        const response: any = await ArticleCreateService(payload)

        if (response.status !== 201) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Create Article')
      }
    },
  })
}

export const useArticleUpdate = () => {
  return useMutation({
    mutationKey: ['update_article'],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: ArticlePayload
    }) => {
      try {
        const response: any = await ArticleUpdateService(id, payload)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Update Article')
      }
    },
  })
}

export const useArticleDelete = () => {
  return useMutation({
    mutationKey: ['delete_article'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await ArticleDeleteService(id)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Delete Article')
      }
    },
  })
}
