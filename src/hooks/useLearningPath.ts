import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query'

import {
  LearningPathListService,
  LearningPathDetailService,
  LearningPathCreateService,
  LearningPathUpdateService,
  LearningPathDeleteService,
  LearningPathFrameworkOptionsService,
  LearningPathCourseOptionsService,
  type LearningPathPayload,
} from '@/services/learningPath'

export const useLearningPath = (search: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['learning_path_list', search],
    queryFn: async () => {
      try {
        const { data, status } = await LearningPathListService(search)
        if (status !== 200) throw new Error()
        return data
      } catch (e) {
        return []
      }
    },
    refetchOnWindowFocus: false,
  })
}

export const useLearningPathDetail = (id?: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['learning_path_detail', id],
    queryFn: async () => {
      try {
        const { data, status } = await LearningPathDetailService(id!)
        if (status !== 200) return null
        return data
      } catch (e) {
        return null
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  })
}

export const useLearningPathCreate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['create_learning_path'],
    mutationFn: async (payload: LearningPathPayload) => {
      try {
        const response: any = await LearningPathCreateService(payload)
        if (response.status !== 201) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Create Learning Path')
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning_path_list'] }),
  })
}

export const useLearningPathUpdate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['update_learning_path'],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: LearningPathPayload
    }) => {
      try {
        const response: any = await LearningPathUpdateService(id, payload)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Update Learning Path')
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning_path_list'] }),
  })
}

export const useLearningPathDelete = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['delete_learning_path'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await LearningPathDeleteService(id)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Delete Learning Path')
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning_path_list'] }),
  })
}

/** Opsi framework & category utk form (framework yang dipilih menyaring category). */
export const useLearningPathFrameworkOptions = (framework?: string) => {
  return useQuery({
    queryKey: ['learning_path_frameworks', framework],
    queryFn: async () => {
      try {
        const { data, status } = await LearningPathFrameworkOptionsService(framework)
        if (status !== 200) {
          return { frameworks: [] as any[], categories: [] as any[] }
        }
        return data
      } catch (e) {
        return { frameworks: [] as any[], categories: [] as any[] }
      }
    },
    refetchOnWindowFocus: false,
  })
}

/** Course yang boleh dipilih utk path (framework+category cocok). */
export const useLearningPathCourseOptions = (params: {
  id?: string
  framework?: string
  category?: string
}) => {
  return useQuery({
    queryKey: ['learning_path_course_options', params],
    queryFn: async () => {
      const { data, status } = await LearningPathCourseOptionsService(params)
      if (status !== 200) return []
      return data
    },
    enabled: !!(params.framework && params.category),
    refetchOnWindowFocus: false,
  })
}