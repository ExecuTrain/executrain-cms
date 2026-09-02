import AxiosClient from '@/lib/axios'

export interface TeamSizeItem {
  quantity: number
  type: string
}

export interface TestimonialItem {
  testimoni: string
  name: string
  company: string
}

export interface CaseStudyPayload {
  title: string
  category?: string
  description: string
  industries: string[]
  solutions: string[]
  deployment_type?: string
  timeline: number
  compliance?: string
  methodology?: string
  team_size: TeamSizeItem[]
  testimonial: TestimonialItem
  link?: string
}

export async function CaseStudyListService(search?: string) {
  try {
    const params = search ? { search } : {}

    const { data: response } = await AxiosClient.get('/case-study', {
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
    return { status: 500, message: 'Failed to fetch Case Studies', data: [] }
  }
}

export async function CaseStudyDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/case-study/${id}`)

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return { status: 404, message: 'Case Study not found', data: null }
  }
}

export async function CaseStudyCreateService(payload: CaseStudyPayload) {
  try {
    const { data: response } = await AxiosClient.post('/case-study', payload)

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

export async function CaseStudyUpdateService(
  id: string,
  payload: CaseStudyPayload,
) {
  try {
    const { data: response } = await AxiosClient.put(
      `/case-study/${id}`,
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

export async function CaseStudyDeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/case-study/${id}`)

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