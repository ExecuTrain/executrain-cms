import { useMutation, useQuery, type UseQueryResult } from '@tanstack/react-query'

import {
  SkillAcceleratorListService,
  SkillAcceleratorDetailService,
  SkillAcceleratorCreateService,
  SkillAcceleratorUpdateService,
  SkillAcceleratorDeleteService,
  type SkillAcceleratorPayload,
} from '@/services/skillAccelerator'

export const useSkillAccelerator = (search: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['skill_accelerator_list', search],
    queryFn: async () => {
      try {
        const { data, status } = await SkillAcceleratorListService(search)

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

export const useSkillAcceleratorDetail = (
  id?: string,
): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ['skill_accelerator_detail', id],
    queryFn: async () => {
      try {
        const { data, status } = await SkillAcceleratorDetailService(id!)

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

export const useSkillAcceleratorCreate = () => {
  return useMutation({
    mutationKey: ['create_skill_accelerator'],
    mutationFn: async (payload: SkillAcceleratorPayload) => {
      try {
        const response: any = await SkillAcceleratorCreateService(payload)

        if (response.status !== 201) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Create Skill Accelerator')
      }
    },
  })
}

export const useSkillAcceleratorUpdate = () => {
  return useMutation({
    mutationKey: ['update_skill_accelerator'],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: SkillAcceleratorPayload
    }) => {
      try {
        const response: any = await SkillAcceleratorUpdateService(id, payload)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Update Skill Accelerator')
      }
    },
  })
}

export const useSkillAcceleratorDelete = () => {
  return useMutation({
    mutationKey: ['delete_skill_accelerator'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await SkillAcceleratorDeleteService(id)

        if (response.status !== 200) throw new Error(response.message)

        return {
          data: response.data,
        }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Delete Skill Accelerator')
      }
    },
  })
}