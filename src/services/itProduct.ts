import AxiosClient from '@/lib/axios'

export interface HighlightItem {
  image: string
  title: string
  description: string
}

export interface ITProductPayload {
  title: string
  description: string
  banner?: any
  tech_stack: string[]
  link?: string
  problem?: string
  feature: string[]
  compliance?: string
  highlight: HighlightItem[]
}

export async function ITProductListService(search?: string) {
  try {
    const params = search ? { search } : {}

    const { data: response } = await AxiosClient.get('/it-product', { params })

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch IT Products', data: [] }
  }
}

export async function ITProductDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/it-product/${id}`)

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return { status: 404, message: 'IT Product not found', data: null }
  }
}

export async function ITProductCreateService(payload: ITProductPayload) {
  try {
    const { data: response } = await AxiosClient.post('/it-product', payload)

    const { status, message, data } = response

    if (status !== 201) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function ITProductUpdateService(
  id: string,
  payload: ITProductPayload,
) {
  try {
    const { data: response } = await AxiosClient.put(
      `/it-product/${id}`,
      payload,
    )

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function ITProductDeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/it-product/${id}`)

    const { status, message } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
    }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}