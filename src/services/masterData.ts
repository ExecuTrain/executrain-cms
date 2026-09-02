import AxiosClient from '@/lib/axios'

export interface MasterDataItem {
  id: string
  type: string
  label: string
  value: string
  sort_order: number
  created_at: string
  updated_at: string
}

export async function MasterDataListService(type?: string) {
  try {
    const params = type ? { type } : {}
    const { data: response } = await AxiosClient.get('/master-data', { params })

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch master data', data: [] }
  }
}

export async function MasterDataByTypeService(type: string) {
  try {
    const { data: response } = await AxiosClient.get(`/master-data/${type}`)

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch master data', data: [] }
  }
}

export interface MasterDataPayload {
  type: string
  label: string
  value: string
  sort_order?: number
}

export async function MasterDataCreateService(payload: MasterDataPayload) {
  try {
    const { data: response } = await AxiosClient.post('/master-data', payload)

    const { status, message, data } = response

    if (status !== 201) throw new Error(message)

    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function MasterDataUpdateService(
  id: string,
  payload: MasterDataPayload,
) {
  try {
    const { data: response } = await AxiosClient.put(
      `/master-data/${id}`,
      payload,
    )

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function MasterDataDeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/master-data/${id}`)

    const { status, message } = response

    if (status !== 200) throw new Error(message)

    return { status, message }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}
