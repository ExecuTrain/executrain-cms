import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  MasterDataListService,
  MasterDataByTypeService,
  MasterDataCreateService,
  MasterDataUpdateService,
  MasterDataDeleteService,
  type MasterDataPayload,
} from '@/services/masterData'

export const useMasterData = (type?: string) => {
  return useQuery({
    queryKey: ['master-data', type ?? 'all'],
    queryFn: () => MasterDataListService(type),
  })
}

export const useMasterDataByType = (type?: string) => {
  return useQuery({
    queryKey: ['master-data', type],
    queryFn: () => MasterDataByTypeService(type!),
    enabled: !!type,
  })
}

export const useMasterDataCreate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: MasterDataPayload) => MasterDataCreateService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['master-data'] })
    },
  })
}

export const useMasterDataUpdate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MasterDataPayload }) =>
      MasterDataUpdateService(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['master-data'] })
    },
  })
}

export const useMasterDataDelete = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => MasterDataDeleteService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['master-data'] })
    },
  })
}
