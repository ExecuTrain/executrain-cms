import AxiosClient from '@/lib/axios'

export interface RoleItem {
  id: string
  name: string
  description: string | null
  is_system: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  user_count: number
  menu_ids: string[]
}

export interface MenuItemData {
  id: string
  code: string
  label: string
  path: string | null
  icon: string | null
  parent_code: string | null
  sort_order: number
  is_active: boolean
  is_superadmin_only?: boolean
}

export interface RoleOption {
  id: string
  name: string
}

/** Menu tree dari /access/my-menus */
export interface MyMenuItem {
  id: string
  code: string
  label: string
  path: string | null
  icon: string | null
  children?: MyMenuItem[]
}

export interface RolePayload {
  name: string
  description?: string
  menu_ids: string[]
}

export async function RoleListService() {
  try {
    const { data: response } = await AxiosClient.get('/access/roles')
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch roles', data: [] }
  }
}

export async function MenuListService() {
  try {
    const { data: response } = await AxiosClient.get('/access/menus')
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch menus', data: [] }
  }
}

export async function MyMenusService() {
  try {
    const { data: response } = await AxiosClient.get('/access/my-menus')
    const { status, message, role, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, role, data }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch menus', data: [] }
  }
}

export async function RoleOptionsService() {
  try {
    const { data: response } = await AxiosClient.get('/access/role-options')
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch role options', data: [] }
  }
}

export async function RoleCreateService(payload: RolePayload) {
  try {
    const { data: response } = await AxiosClient.post('/access/roles', payload)
    const { status, message, data } = response
    if (status !== 201) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function RoleUpdateService(id: string, payload: Partial<RolePayload> & { is_active?: boolean }) {
  try {
    const { data: response } = await AxiosClient.put(`/access/roles/${id}`, payload)
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function RoleDeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/access/roles/${id}`)
    const { status, message } = response
    if (status !== 200) throw new Error(message)
    return { status, message }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}
