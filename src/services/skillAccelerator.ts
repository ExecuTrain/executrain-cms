import AxiosClient from '@/lib/axios'

export interface SkillAcceleratorPayload {
  title: string
  banner?: string
  category: string
  description: string
  student: number
  duration: number
  skill_level: string
  language: string
  feature: string[]
}

export async function SkillAcceleratorListService(search?: string) {
  try {
    const params = search ? { search } : {}

    const { data: response } = await AxiosClient.get('/skill-accelerator', {
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
    return { status: 500, message: 'Failed to fetch skill accelerators', data: [] }
  }
}

export async function SkillAcceleratorDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/skill-accelerator/${id}`)

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return { status: 404, message: 'Skill accelerator not found', data: null }
  }
}

export async function SkillAcceleratorCreateService(payload: SkillAcceleratorPayload) {
  try {
    const { data: response } = await AxiosClient.post('/skill-accelerator', payload)

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

export async function SkillAcceleratorUpdateService(
  id: string,
  payload: SkillAcceleratorPayload,
) {
  try {
    const { data: response } = await AxiosClient.put(
      `/skill-accelerator/${id}`,
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

export async function SkillAcceleratorDeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/skill-accelerator/${id}`)

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