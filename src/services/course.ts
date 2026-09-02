import AxiosClient from '@/lib/axios'

export interface CoursePayload {
  title: string
  banner?: string
  category: string
  description: string
  student: number
  duration: number
  skill_level: string
  language: string
  framework_type: string
  feature: string[]
}

export async function CourseListService(search?: string) {
  try {
    const params = search ? { search } : {}

    const { data: response } = await AxiosClient.get('/course', {
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
    return { status: 500, message: 'Failed to fetch courses', data: [] }
  }
}

export async function CourseDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/course/${id}`)

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return { status: 404, message: 'Course not found', data: null }
  }
}

export async function CourseCreateService(payload: CoursePayload) {
  try {
    const { data: response } = await AxiosClient.post('/course', payload)

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

export async function CourseUpdateService(
  id: string,
  payload: CoursePayload,
) {
  try {
    const { data: response } = await AxiosClient.put(
      `/course/${id}`,
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

export async function CourseDeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/course/${id}`)

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