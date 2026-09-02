import AxiosClient from '@/lib/axios'

export interface TeamSizeItem {
  quantity: number
  type: string
}

export interface HighlightItem {
  image: string
  title: string
  description: string
}

export interface AppDevelopmentPayload {
  title: string
  tech_stack: string[]
  description: string
  challenge?: string
  team_size: TeamSizeItem[]
  timeline: number
  methodology?: string
  compliance?: string
  highlights: HighlightItem[]
}

export async function AppDevelopmentListService(search?: string) {
  try {
    const params = search ? { search } : {}

    const { data: response } = await AxiosClient.get('/app-development', {
      params,
    })

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch App Development', data: [] }
  }
}

export async function AppDevelopmentDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/app-development/${id}`)

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return { status: 404, message: 'App Development not found', data: null }
  }
}

export async function AppDevelopmentCreateService(payload: AppDevelopmentPayload) {
  try {
    const { data: response } = await AxiosClient.post('/app-development', payload)

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

export async function AppDevelopmentUpdateService(
  id: string,
  payload: AppDevelopmentPayload,
) {
  try {
    const { data: response } = await AxiosClient.put(
      `/app-development/${id}`,
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

export async function AppDevelopmentDeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/app-development/${id}`)

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