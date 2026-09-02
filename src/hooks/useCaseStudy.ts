import { useMutation, useQuery, type UseQueryResult } from '@tanstack/react-query'

import {
  CaseStudyListService,
  CaseStudyDetailService,
  CaseStudyCreateService,
  CaseStudyUpdateService,
  CaseStudyDeleteService,
  type CaseStudyPayload,
} from '@/services/caseStudy'

export const useCaseStudy = (search: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['case_study_list', search],
    queryFn: async () => {
      try {
        const { data, status } = await CaseStudyListService(search)

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

export const useCaseStudyDetail = (id?: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['case_study_detail', id],
    queryFn: async () => {
      try {
        const { data, status } = await CaseStudyDetailService(id!)

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

export const useCaseStudyCreate = () => {
  return useMutation({
    mutationKey: ['create_case_study'],
    mutationFn: async (payload: CaseStudyPayload) => {
      try {
        const response: any = await CaseStudyCreateService(payload)

        if (response.status !== 201) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Create Case Study')
      }
    },
  })
}

export const useCaseStudyUpdate = () => {
  return useMutation({
    mutationKey: ['update_case_study'],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: CaseStudyPayload
    }) => {
      try {
        const response: any = await CaseStudyUpdateService(id, payload)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Update Case Study')
      }
    },
  })
}

export const useCaseStudyDelete = () => {
  return useMutation({
    mutationKey: ['delete_case_study'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await CaseStudyDeleteService(id)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Delete Case Study')
      }
    },
  })
}