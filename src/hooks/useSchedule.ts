import { useMutation, useQuery, type UseQueryResult } from '@tanstack/react-query'

import {
  ScheduleListService,
  ScheduleOptionsService,
  ScheduleDetailService,
  ScheduleCreateService,
  ScheduleUpdateService,
  ScheduleDeleteService,
  ScheduleDeleteManyService,
  ScheduleRangeCreateService,
  ScheduleRangeUpdateService,
  ScheduleTemplateDownloadService,
  ScheduleImportPreviewService,
  ScheduleImportConfirmService,
  type SchedulePayload,
} from '@/services/schedule'

export const useScheduleList = (month: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['schedule_list', month],
    queryFn: async () => {
      try {
        const { data, status } = await ScheduleListService(month)
        if (status !== 200) throw new Error()
        return data
      } catch (e) {
        return []
      }
    },
    refetchOnWindowFocus: false,
  })
}

export const useScheduleOptions = (
  type: 'COURSE' | 'SKILL_ACCELERATOR' | null,
): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['schedule_options', type],
    queryFn: async () => {
      try {
        const { data, status, meta } = await ScheduleOptionsService(
          type as 'COURSE' | 'SKILL_ACCELERATOR',
        )
        if (status !== 200) throw new Error()
        return { data, meta }
      } catch (e) {
        return { data: [], meta: {} }
      }
    },
    enabled: !!type,
    refetchOnWindowFocus: false,
  })
}

export const useScheduleDetail = (id?: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['schedule_detail', id],
    queryFn: async () => {
      try {
        const { data, status } = await ScheduleDetailService(id!)
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

export const useScheduleCreate = () => {
  return useMutation({
    mutationKey: ['create_schedule'],
    mutationFn: async (payload: SchedulePayload) => {
      try {
        const response: any = await ScheduleCreateService(payload)
        if (response.status !== 201) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Create Schedule')
      }
    },
  })
}

export const useScheduleUpdate = () => {
  return useMutation({
    mutationKey: ['update_schedule'],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<SchedulePayload>
    }) => {
      try {
        const response: any = await ScheduleUpdateService(id, payload)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Update Schedule')
      }
    },
  })
}

export const useScheduleRangeCreate = () => {
  return useMutation({
    mutationKey: ['create_schedule_range'],
    mutationFn: async (payload: {
      entity_type: 'COURSE' | 'SKILL_ACCELERATOR'
      entity_id: string
      start_date: string
      end_date: string
    }) => {
      try {
        const response: any = await ScheduleRangeCreateService(payload)
        if (response.status !== 201) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Create Schedule Range')
      }
    },
  })
}

export const useScheduleRangeUpdate = () => {
  return useMutation({
    mutationKey: ['update_schedule_range'],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: {
        entity_type?: 'COURSE' | 'SKILL_ACCELERATOR'
        entity_id?: string
        start_date: string
        end_date: string
        replace_ids?: string[]
      }
    }) => {
      try {
        const response: any = await ScheduleRangeUpdateService(id, payload)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Update Schedule Range')
      }
    },
  })
}

export const useScheduleDelete = () => {
  return useMutation({
    mutationKey: ['delete_schedule'],
    mutationFn: async (ids: string | string[]) => {
      try {
        const idList = Array.isArray(ids) ? ids : [ids]
        let response: any
        if (idList.length > 1) {
          response = await ScheduleDeleteManyService(idList)
        } else {
          response = await ScheduleDeleteService(idList[0])
        }
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to Delete Schedule')
      }
    },
  })
}

export const useScheduleImportPreview = () => {
  return useMutation({
    mutationKey: ['schedule_import_preview'],
    mutationFn: async ({
      type,
      file,
    }: {
      type: 'COURSE' | 'SKILL_ACCELERATOR'
      file: File
    }) => {
      try {
        const response: any = await ScheduleImportPreviewService(type, file)
        if (response.status !== 200) throw new Error(response.message)
        return response.data
      } catch (error: any) {
        throw new Error(error.message || 'Failed to preview file')
      }
    },
  })
}

export const useScheduleImportConfirm = () => {
  return useMutation({
    mutationKey: ['schedule_import_confirm'],
    mutationFn: async (rows: any[]) => {
      try {
        const response: any = await ScheduleImportConfirmService(rows)
        if (response.status !== 201) throw new Error(response.message)
        return response.data
      } catch (error: any) {
        throw new Error(error.message || 'Failed to save import')
      }
    },
  })
}

export const useScheduleTemplateDownload = () => {
  return useMutation({
    mutationKey: ['schedule_template_download'],
    mutationFn: async (type: 'COURSE' | 'SKILL_ACCELERATOR') => {
      try {
        const response: any = await ScheduleTemplateDownloadService(type)
        if (response.status !== 200 || !response.data) {
          throw new Error('Failed to download template')
        }
        return response.data as Blob
      } catch (error: any) {
        throw new Error(error.message || 'Failed to download template')
      }
    },
  })
}