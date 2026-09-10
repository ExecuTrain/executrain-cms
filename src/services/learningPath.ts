import AxiosClient from '@/lib/axios'

export interface LearningPathStageLink {
  course_id: string
  follows_course_id: string
}

export interface LearningPathStagePayload {
  id?: string
  name: string
  description?: string
  course_ids: string[]
  course_links?: LearningPathStageLink[]
  sort_order?: number
}

export interface LearningPathPayload {
  title: string
  framework: string
  category: string
  is_active?: boolean
  stages: LearningPathStagePayload[]
}

export interface FrameworkCategoryOptions {
  frameworks: { value: string; label: string }[]
  categories: { value: string; label: string; framework?: string }[]
}

export async function LearningPathListService(search?: string) {
  try {
    const params = search ? { search } : {}
    const { data: response } = await AxiosClient.get('/learning-path', { params })
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch learning paths', data: [] }
  }
}

export async function LearningPathDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/learning-path/${id}`)
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return { status: 404, message: 'Learning Path not found', data: null }
  }
}

export async function LearningPathCreateService(payload: LearningPathPayload) {
  try {
    const { data: response } = await AxiosClient.post('/learning-path', payload)
    const { status, message, data } = response
    if (status !== 201) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function LearningPathUpdateService(
  id: string,
  payload: LearningPathPayload,
) {
  try {
    const { data: response } = await AxiosClient.put(`/learning-path/${id}`, payload)
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function LearningPathDeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/learning-path/${id}`)
    const { status, message } = response
    if (status !== 200) throw new Error(message)
    return { status, message }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

/** Opsi framework (scope) & category utk form. */
export async function LearningPathFrameworkOptionsService(framework?: string) {
  try {
    const params = framework ? { framework } : {}
    const { data: response } = await AxiosClient.get(
      '/learning-path/framework-options',
      { params },
    )
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return {
      status: 500,
      message: 'Failed to fetch framework options',
      data: { frameworks: [], categories: [] },
    }
  }
}

/** Course yang boleh dipilih utk sebuah path/category. */
export async function LearningPathCourseOptionsService(params: {
  id?: string
  framework?: string
  category?: string
  search?: string
}) {
  try {
    const { data: response } = await AxiosClient.get('/learning-path/course-options', {
      params,
    })
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch course options', data: [] }
  }
}
