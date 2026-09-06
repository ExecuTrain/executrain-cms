import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  RoleListService,
  MenuListService,
  MyMenusService,
  RoleOptionsService,
  RoleCreateService,
  RoleUpdateService,
  RoleDeleteService,
  type RolePayload,
} from '@/services/access'
import { useAuth } from '@/lib/auth'

export const useRoleList = () => {
  return useQuery({
    queryKey: ['access-roles'],
    queryFn: async () => {
      const res = await RoleListService()
      if (res.status !== 200) throw new Error(res.message)
      return res.data as any[]
    },
  })
}

export const useMenuList = () => {
  return useQuery({
    queryKey: ['access-menus'],
    queryFn: async () => {
      const res = await MenuListService()
      if (res.status !== 200) throw new Error(res.message)
      return res.data as any[]
    },
  })
}

/** Menu sidebar utk user yg login (dipakai Sidebar) */
export const useMyMenus = () => {
  const { state } = useAuth()
  return useQuery({
    queryKey: ['access-my-menus'],
    queryFn: async () => {
      const res = await MyMenusService()
      if (res.status !== 200) throw new Error(res.message)
      return { role: res.role as string, menus: res.data as any[] }
    },
    enabled: state.hasLogin,
    staleTime: 60_000,
    retry: 1,
  })
}

export const useRoleOptions = () => {
  const { state } = useAuth()
  return useQuery({
    queryKey: ['access-role-options'],
    queryFn: async () => {
      const res = await RoleOptionsService()
      if (res.status !== 200) throw new Error(res.message)
      return res.data as { id: string; name: string }[]
    },
    enabled: state.hasLogin,
  })
}

export const useRoleCreate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RolePayload) => RoleCreateService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['access-roles'] })
    },
  })
}

export const useRoleUpdate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      RoleUpdateService(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['access-roles'] })
    },
  })
}

export const useRoleDelete = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => RoleDeleteService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['access-roles'] })
    },
  })
}
