import { useMutation, useQuery, type UseQueryResult } from '@tanstack/react-query'

import {
  CourseListService,
  CourseDetailService,
  CourseCreateService,
  CourseUpdateService,
  CourseDeleteService,
  type CoursePayload,
} from '@/services/course'

export const useCourse = (search: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['course_list', search],
    queryFn: async () => {
      try {
        const { data, status } = await CourseListService(search)

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

export const useCourseDetail = (
  id?: string,
): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['course_detail', id],
    queryFn: async () => {
      try {
        const { data, status } = await CourseDetailService(id!)

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

export const useCourseCreate = () => {
  return useMutation({
    mutationKey: ['create_course'],
    mutationFn: async (payload: CoursePayload) => {
      try {
        const response: any = await CourseCreateService(payload)

        if (response.status !== 201) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Create Course')
      }
    },
  })
}

export const useCourseUpdate = () => {
  return useMutation({
    mutationKey: ['update_course'],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: CoursePayload
    }) => {
      try {
        const response: any = await CourseUpdateService(id, payload)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Update Course')
      }
    },
  })
}

export const useCourseDelete = () => {
  return useMutation({
    mutationKey: ['delete_course'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await CourseDeleteService(id)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Delete Course')
      }
    },
  })
}